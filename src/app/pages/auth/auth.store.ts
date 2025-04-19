import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from "rxjs";
import { tapResponse } from '@ngrx/operators';
import { AuthHttpService } from "./auth.http.service";

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
  resendTimer: 60,
  isResendDisabled: false
}

export const AuthStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store, authHttpService = inject(AuthHttpService))=>({
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
      patchState(store, { isLoading: true });
      authHttpService.resendToken(store.tokenId()).subscribe({
        next: ({ id }) => {
          patchState(store, { tokenId: id, isLoading: false });
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
