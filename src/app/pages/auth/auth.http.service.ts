import { Injectable, computed, inject } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

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
    // check if resendisDisabled
    const body = {
      loginTokenId
    };
    return this.http.post<{id: string}>(`${this.baseUrl}UserLogin/resendtoken`,body)
  }
}
