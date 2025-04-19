import { SnackBarService } from './../../components/snackbar/snackbar.service';
import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpInterceptorService } from './http-interceptor.service';
import { ErrorResponse, SuccessResponse, TableResponse } from './http-interceptor.model';

export const httpInterceptor: HttpInterceptorFn = (request, next): Observable<HttpEvent<unknown>> => {
  const httpInterceptorService = inject(HttpInterceptorService);
  const snackBarService = inject(SnackBarService);

  if(httpInterceptorService.hasBaseUrl(request.url))
    return next(request).pipe(
    map((response: HttpEvent<any>)=>{
      if(!(response instanceof HttpResponse)) return response;
      if(!httpInterceptorService.isSuccessResponse<SuccessResponse>(response.body)) return response;
      if(response.body.message){
        const messageArray = response.body.message.split(' : '),
        header = messageArray[0],
        message = messageArray.length > 1 ? messageArray[1] : '';
        snackBarService.show({headingText: header, messageText: message, durationType: 'medium', iconType: 'info'});
      }
      const modifiedResponse = httpInterceptorService.modifyResponse(response);
      if(httpInterceptorService.isTableResponse<TableResponse>(modifiedResponse.body)) return httpInterceptorService.mapTable(modifiedResponse)
      return modifiedResponse;
    }),
    catchError((error: HttpErrorResponse)=>{
      const err = error.error;
      const errorData: ErrorResponse = typeof err === 'string' ? JSON.parse(err) : err;
      if(err && err.statusCode === 500){
        // add logic here
        // show 500 modal
      }else{
        if(errorData && errorData.message){
          if(errorData.message == 'One or more validation errors occured' && Array.isArray(errorData.errors)){
            errorData.errors.forEach((e)=>{
              const messageArray = ((Array.isArray(e.message) ? e.message[0] : e.message) ?? '').split(' : '),
              header = messageArray[0],
              message = messageArray[1] ?? '';
              if(header) snackBarService.show({headingText: header, messageText: message, durationType: 'medium', iconType: 'danger'});
            })
          } else if((errorData.statusCode === 400 || errorData.statusCode === 403) && errorData.message === 'User is denied access'){
            // navigate
          } else{
            const messageArray = errorData.message.split(' : '),
            header = messageArray[0],
            message = messageArray[1] ?? '';
            snackBarService.show({headingText: header, messageText: message, durationType: 'medium', iconType: 'danger'});
          }
        }
      }

      if(error instanceof HttpErrorResponse){
        const mappedError: any = {
          errors: errorData?.errors,
          status: error.status,
          statusText: err && err.isExpired && err.error === 'invalid_token' ? err.error : null,
          data: errorData
        };

        err.errorCode ? mappedError.errorCode = err.errorCode : delete mappedError.errorCode;

        return throwError(()=> mappedError);
      }else{
        return throwError(()=>error)
      }
    })
    )
  else
  return next(request);
};
