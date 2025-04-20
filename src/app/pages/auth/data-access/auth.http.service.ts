import { Injectable, computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { TokenLoginRequest, TokenLoginResponse } from "./models/auth.model";
import { environment } from "@src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService{
  readonly baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  // Http Calls
  sendToken(email: string):Observable<{id: string}>{
    const body = {
      email
    };
    return this.http.post<{id: string}>(`${this.baseUrl}UserLogin/sendToken`,body);
  }

  resendToken(loginTokenId: string):Observable<{id: string}>{
    const body = {
      loginTokenId
    };
    return this.http.post<{id: string}>(`${this.baseUrl}UserLogin/resendtoken`,body)
  }

  emailTokenLogin(body: TokenLoginRequest): Observable<TokenLoginResponse>{
    return this.http.post<TokenLoginResponse>(`${this.baseUrl}UserLogin/EmailTokenLogin`, body)
  }
}
