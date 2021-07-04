import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MonitorDialog } from 'src/app/shared/dialogs/monitor-dialog';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {


    constructor(private dialog: MatDialog) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {
                    this.showMessageDialog('Erro', error)
                    return throwError(error);
                })
            )
    }

    showMessageDialog(title, body) {
        this.dialog.open(MonitorDialog, {
            width: '500px',
            data: {
                data: -1,
                message: {
                    title: title,
                    body: body.error.mensagemErro
                }
            }
        });
    }
}