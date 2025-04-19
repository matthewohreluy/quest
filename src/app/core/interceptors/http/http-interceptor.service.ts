import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService{

  hasBaseUrl(url: string){
    return url.includes(environment.apiUrl);
  }

  isSuccessResponse<T>(obj: T): obj is T{
    return (
      obj &&
      typeof obj === 'object' &&
      'message' in obj  &&
      'statusCode' in obj &&
      'title' in obj
    )
  }

  modifyResponse(response: HttpResponse<any>): HttpResponse<any>{
    return response.clone({
      body: response.body.data
    })
  }

  isTableResponse<T>(obj: T): obj is T{
    return (
      obj &&
      typeof obj === 'object' &&
      'count' in obj &&
      'items' in obj &&
      'page' in obj &&
      'pageSize' in obj
    )
  }

  mapTable(response: HttpResponse<any>): HttpResponse<any>{
    return response.clone({
      body: {
        currentPage: response.body.page,
        data: response.body.items,
        pageSize: response.body.pageSize,
        totalCount: response.body.count
      }
    })
  }
}
