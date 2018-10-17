import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Token } from './models/token';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private httpClient: HttpClient, private cookieService: CookieService, private router: Router) { }

  public redirectUrl: string = null;
  private _token: Token = null;
  private _reauthenticating = false;

  public get verifyIsAuthenticated(): Observable<boolean> {
    if (this._token === null) {
      return this.reauthenticate();
    } else {
      if (this.isTokenStillValid()) {
        return new Observable<boolean>((observer) => { observer.next(true); observer.complete() })
      } else {
        return this.reauthenticate();
      }
    }
  }

  private isTokenStillValid(): boolean {
    var expires = moment.utc(this._token['.expires'], 'ddd, DD MMM YYYY HH:mm:ss zz').subtract(1, 'm');
    return expires.isAfter(moment());
  }
  private current: Subject<boolean> = new Subject<boolean>();

  private reauthenticate(): Subject<boolean> {
    if (this._reauthenticating) {
      return this.current;
    }
    if (this.cookieService.check('refreshtoken')) {
      this._reauthenticating = true;
      this.httpClient.post<Token>(`${environment.authenticationApi}/token`, new HttpParams()
        .set('grant_type', 'refresh_token')
        .set('refresh_token', this.cookieService.get('refreshtoken'))
        .set('client_id', 'angular'), {
          headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }), withCredentials: true
        }).pipe(map((data: Token) => {
          this.processToken(data);
          this._reauthenticating = false;
          return true;
        }), catchError((_error, _caught) => {
          this.cookieService.delete('refreshtoken');
          return new Observable<boolean>(observer => {
            this._reauthenticating = false;
            observer.next(false);
            observer.complete();
          })
        })).subscribe(this.current);
      return this.current;
    } else {
      this.current.next(false);
      return this.current;
    }

  }

  private processToken(token: Token): void {
    this._token = token;
    this.cookieService.set('refreshtoken', this._token.refresh_token);

  }

  public get username(): string {
    if (this._token === null) { return null; }
    return this._token.userName;
  }

  public get authenticatedHeader(): Observable<string> {
    if (this._token === null) {
      return new Observable<string>(observer => observer.next(null));
    } else {
      if (this.isTokenStillValid) {
        return new Observable<string>(observer => observer.next(`${this._token.token_type} ${this._token.access_token}`));
      } else {
        this.reauthenticate().pipe(map(() => {
          return `${this._token.token_type} ${this._token.access_token}`;
        }))
      }
    }
  }

  public login(username: string, password: string): Observable<boolean> {
    return this.httpClient.post<Token>(`${environment.authenticationApi}/token`, new HttpParams()
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', password)
      .set('client_id', environment.apiClientId).toString()
      , { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }), withCredentials: true })
      .pipe(map((data: Token) => {
        this.processToken(data);
        return true;
      }));
  }
  public logout() {
    this._token = null;
    this.cookieService.delete('refreshtoken');
    this.router.navigate(['/landing']);
  }
}
