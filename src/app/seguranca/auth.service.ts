import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl: string;
  tokensRenokeUrl: string;
  jwtPayLoad: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
    ) {
      this.oauthTokenUrl = `${environment.apiUrl}/oauth/token`;
      this.tokensRenokeUrl = `${environment.apiUrl}/tokens/revoke`;
      this.carregarToken();
    }

  obterNovoAccessToken(): Promise<void> {
    const headers = new HttpHeaders()
    .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==')
    .append('Content-Type', 'application/x-www-form-urlencoded');

    const body = 'grant_type=refresh_token';

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
    .toPromise()
    .then(response => {
      this.armazenarToken(response['access_token']);

      console.log('Novo access token criado!');
      return Promise.resolve(null);
    })
    .catch(response => {
      console.error('Erro ao renovar token.', response);
      return Promise.resolve(null);
    });
  }

  login(usuario: string, senha: string): Promise<void> {
    const headers = new HttpHeaders()
     .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==')
     .append('Content-Type', 'application/x-www-form-urlencoded');
    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
     .toPromise()
     .then(response => {
      this.armazenarToken(response['access_token']);
     })
     .catch(response => {
      const responseError = response.error;
      if (response.status === 400) {
        if (responseError.error === 'invalid_grant') {
        return Promise.reject('Usuário ou senha inválida!');
        }
      }
      return Promise.reject(response);
     });
  }

  private armazenarToken(token: string) {
    this.jwtPayLoad = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }

  temPermissao(permissao: string) {
    return this.jwtPayLoad && this.jwtPayLoad.authorities.includes(permissao);
  }

  temQualquerPermissao(roles) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }
    return false;
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');
    console.log(this.jwtPayLoad);
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayLoad = null;
  }

}
