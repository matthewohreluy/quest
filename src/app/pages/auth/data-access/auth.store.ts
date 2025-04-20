import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

import { catchError, filter, map, Observable, of, pipe, switchMap, tap, throwError } from "rxjs";
import { AuthHttpService } from "./auth.http.service";
import { TokenLoginRequest } from "./models/auth.model";
import { StorageService } from "@app/core/services/storage.service";

const DEFAULT_TIME = 60;

type AuthState = {
  email: string;
  tokenId: string;
  isLoading: boolean;
  resendTimer: number;
  isResendDisabled: boolean;
}

const initialState: AuthState = {
  email: '',
  tokenId: '',
  isLoading: false,
  resendTimer: DEFAULT_TIME,
  isResendDisabled: false
}



export const AuthStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((
    store,
    authHttpService = inject(AuthHttpService),
    storageService = inject(StorageService)
  ) => {
    let countdownInterval: any = null;

    const methods = {
      setToken(tokenId: string) {
        patchState(store, { tokenId });
      },
      login(email: string): Observable<string>{
        patchState(store, { isLoading: true, email })
        return authHttpService.sendToken(email).pipe(
          map(({id})=>{
            patchState(store, { tokenId: id, isLoading: false });
            const expiry = Date.now() + 60_000;
            storageService.localStorageSet('resend_expiry', expiry);
            methods.startResendCountdown();
            return id;
          }),
          catchError((error)=>{
            patchState(store, { isLoading: false, email: '' });
            console.log(store)
            return throwError(()=>error)
          })
        )
      },
      // login: rxMethod<string>(
      //   pipe(
      //     tap((email) => patchState(store, { isLoading: true, email })),
      //     switchMap((email) => authHttpService.sendToken(email)),
      //     tapResponse({
      //       next: ({ id }) => {
      //         patchState(store, { tokenId: id, isLoading: false });
      //         const expiry = Date.now() + 60_000;
      //         storageService.localStorageSet('resend_expiry', expiry);
      //         methods.startResendCountdown();
      //       },
      //       error: () => patchState(store, { isLoading: false, email: '' })
      //     })
      //   )
      // ),
      resendToken() {
        return of(store.isResendDisabled()).pipe(
          filter((isResendDisabled) => !isResendDisabled),
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() => authHttpService.resendToken(store.tokenId())),
          map(({id})=>{
            const expiry = Date.now() + 60_000;
            storageService.localStorageSet('resend_expiry', expiry);
            patchState(store, { tokenId: id, isLoading: false });
            methods.startResendCountdown(DEFAULT_TIME);
            return id;
          }),
          catchError((error)=>{
            patchState(store, { isLoading: false });
            console.log(store)
            return throwError(()=>error)
          })
        )
      },
      startResendCountdown(seconds: number = DEFAULT_TIME) {
        if (countdownInterval) clearInterval(countdownInterval);
        patchState(store, {
          resendTimer: seconds,
          isResendDisabled: true
        });

        countdownInterval = setInterval(() => {
          const current = store.resendTimer();

          if (current > 1) {
            patchState(store, { resendTimer: current - 1 });
          } else {
            patchState(store, {
              resendTimer: 0,
              isResendDisabled: false
            });
            clearInterval(countdownInterval);
            countdownInterval = null;
            storageService.localStorageRemove('resend_expiry');
          }
        }, 1000);
      },
      initResendCountdownIfNeeded() {
        const expiry = +storageService.localStorageGet('resend_expiry');
        const now = Date.now();

        if (expiry && expiry > now) {
          const remaining = Math.floor((expiry - now) / 1000);
          methods.startResendCountdown(remaining); // ✅ again, use `methods`
        }
      },
      verifyEmailTokenLogin(data: TokenLoginRequest){
        patchState(store,{isLoading: true})
        return authHttpService.emailTokenLogin(data).pipe(
          tap((data)=>{
            patchState(store,{isLoading: false});
            storageService.sessionStorageSet('accessToken',data.accessToken);
            storageService.sessionStorageSet('refreshToken',data.refreshToken);
            storageService.localStorageSet('accessToken',data.accessToken);
            storageService.localStorageSet('refreshToken',data.refreshToken);
          }),
          catchError((error)=>{
            patchState(store, { isLoading: false });
            return throwError(()=>error)
          })
        )
      }
    };

    return methods;
  }),
  withComputed((store)=>({
    isTokenAvailable: computed(()=>{
      const tokenId = store.tokenId();
      return !!tokenId;
    }),
    maskedEmail: computed(()=>{
      const email = store.email();
      if(!email) return;

      const [local, domain] = email.split('@');
      if(local.length <=2) return email;

      const visible = local.slice(0,2);
      const hidden = '*'.repeat(local.length-2);
      return `${visible}${hidden}@${domain}`;
    })
  }))

)
