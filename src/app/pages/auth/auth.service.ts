import { Injectable, computed, inject } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthStore } from "./auth.store";

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
  readonly isResendDisabled = computed(()=>this.store.isResendDisabled())

  login(email: string){
    this.store.login(email);
  }

  setToken(id: string){
    this.store.setToken(id);
  }

  resendToken(){
    this.store.resendToken();
  }

}
