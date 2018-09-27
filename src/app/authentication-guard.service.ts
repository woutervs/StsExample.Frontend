import { Injectable } from "@angular/core";

import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { AuthorizationService } from "./authorization.service";

import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(private authorizationService: AuthorizationService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authorizationService.verifyIsAuthenticated.pipe(map((result) => {
            if (result) { return true; }
            this.authorizationService.redirectUrl = state.url;
            this.router.navigate(['/landing']);
            return false;
        }));
    }
}