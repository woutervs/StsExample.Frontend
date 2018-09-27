import { Injectable } from '@angular/core';


import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthorizationService } from '../authorization.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
    constructor(public authorizationService: AuthorizationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authorizationService.authenticatedHeader.pipe(mergeMap((header) => {
            if (header !== null) {
                req = req.clone({
                    setHeaders: { Authorization: header }
                });
            }
            return next.handle(req);
        }));
    }
}