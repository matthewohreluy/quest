import { Injectable, computed, inject } from "@angular/core";
import { AuthStore } from "./auth.store";
import { TokenLoginRequest } from "./models/auth.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private store = inject(AuthStore);

  // login
  readonly isLoading = computed(()=>this.store.isLoading());

  // verify Email
  readonly maskedEmail = computed(()=>this.store.maskedEmail());
  readonly isTokenAvailable = computed(()=>this.store.isTokenAvailable());
  readonly tokenId = computed(()=>this.store.tokenId());
  readonly isResendDisabled = computed(()=>this.store.isResendDisabled());
  readonly resendTimer = computed(()=>this.store.resendTimer());

  login(email: string){
   return this.store.login(email);
  }

  setToken(id: string){
    this.store.setToken(id);
  }

  resendToken(){
   return this.store.resendToken();
  }

  verifyEmailTokenLogin(data: TokenLoginRequest){
    return this.store.verifyEmailTokenLogin(data)
  }

  initResendCountdownIfNeeded(){
    this.store.initResendCountdownIfNeeded();
  }

}
