import { computed, effect, inject } from "@angular/core";
import { patchState, signalStore, watchState, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, of, pipe, switchMap, tap } from "rxjs";
import { tapResponse } from '@ngrx/operators';
import { AuthHttpService } from "./auth.http.service";
import { StorageService } from "../../core/services/storage.service";

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
    )=>({
    setToken(tokenId: string){
      patchState(store,{tokenId})
    },
    login: rxMethod<string>(
      pipe(
        tap((email)=>patchState(store,{isLoading: true, email})),
        switchMap((email)=>authHttpService.sendToken(email)),
        tapResponse({
          next: ({id})=> patchState(store,{tokenId: id,isLoading:false}),
          error: ()=> patchState(store,{isLoading: false, email: ''})
          })
        )
      ),
    resendToken(){
      of(store.isResendDisabled()).pipe(
        filter(isResendDisabled=>!isResendDisabled),
        tap(()=>patchState(store, { isLoading: true })),
        switchMap(()=>authHttpService.resendToken(store.tokenId()))
      ).subscribe({
        next: ({ id }) => {
          const expiry = Date.now() + 60_00;
          storageService.localStorageSet('resend_expiry',expiry);
          patchState(store, { tokenId: id, isLoading: false, isResendDisabled: true ,resendTimer: DEFAULT_TIME });
        },
        error: () => {
          patchState(store, { isLoading: false });
        }
      });
    }
  }
  )),
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
