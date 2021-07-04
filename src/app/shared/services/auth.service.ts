import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import * as serviceWorker from './../../../assets/client.js';

@Injectable()
export class AuthService {

  public currentUserSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public currentUser;
  private baseUrl = environment.baseUrl;
  private baseUrlMonitor = environment.baseUrlMonitor;
  private cordenadas;
  private isAdmin;
  private isMatriz;
  private key = [];
  private publicKey;

  get isLoggedIn() {
    return this.currentUserSubject.asObservable();
  }

  get userLogged() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  get boraboraUser() {
    return JSON.parse(localStorage.getItem('boraboraUser'));
  }

  get isSupportUser() {
    return JSON.parse(localStorage.getItem('isSupportUser'));
  }


  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  public get currentUserValue(): any {
    if (this.currentUserSubject.value) {
      return this.currentUserSubject.value
    }
  }
  login(user: any) {
    return this.http.post(this.baseUrlMonitor + 'api/v1/IAM/authentication', user).pipe(map((response: any) => {
      if (response.dataResult) {
        localStorage.setItem('currentUser', JSON.stringify(response));

        if (response.dataResult.data.perfilId == 8) {
          localStorage.setItem('boraboraUser', JSON.stringify(true));
        }

        if (response.dataResult.data.perfis[0] == 11 || response.dataResult.data.perfis[1] == 11) {
          localStorage.setItem('isSupportUser', JSON.stringify(true));
          this.router.navigate(['/veiculo-selecao']);
        } else {
          this.router.navigate(['/home']);
        }

        this.getPublicKey(response.dataResult.data.id, response.dataResult.token);

      }

      return response;
    }));
  }


  getPublicKey(userId, token) {
    this.http.get(this.baseUrlMonitor + 'api/v1/Push/publickey').subscribe((resp: any) => {
      this.publicKey = resp.dataResult;
      setTimeout(() => {
        serviceWorker.setUpServiceWorker(this.publicKey, token, userId);
      }, 400);
    })
  }


  resetSenha(credenciais) {
    return this.http.post(this.baseUrl + 'mottuweb/resetSenha', credenciais);
  }

  logout() {
    localStorage.removeItem('isSupportUser');
    localStorage.removeItem('boraboraUser');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(false);
    this.router.navigate(['/home/login']);
  }
  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

}
