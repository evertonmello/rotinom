
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SupportService {

    private baseUrl = environment.baseUrlMonitor;
    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    getUsuarioSuporte(usuarioSuporteId) {
        return this.http.get(this.baseUrl + 'api/v1/UsuarioSuporte/' + usuarioSuporteId)
    }

    setUserOnline(usuarioSuporteId, isOnline) {
        return this.http.post(this.baseUrl + 'api/v1/UsuarioSuporte/' + usuarioSuporteId + '/online/' + isOnline,{})
    }
}