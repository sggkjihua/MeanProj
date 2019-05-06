import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './Error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        let message = 'unknown error occured';
        if (error.error.message) {
          message = error.error.message;
        }
        this.dialog.open(ErrorComponent, {data: { message }});
        return throwError(error);
      })
    );
  }
}

