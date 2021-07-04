import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from '../../shared/services/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.authService.currentUserSubject.pipe(
            take(1),
            map((currentUserSubject: boolean) => {
                if (this.authService.isSupportUser) {
                    return false;
                }
                return true;
            })
        );
    }
}