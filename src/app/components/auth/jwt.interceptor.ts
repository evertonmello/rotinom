import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../../shared/services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser = this.authService.userLogged;

        if (currentUser && currentUser.dataResult.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.dataResult.token}`
                }
            });
        }

        return next.handle(request);
    }


}
