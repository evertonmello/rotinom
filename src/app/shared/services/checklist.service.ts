import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpBackend, HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable()
export class ChecklistService {

    private baseUrl = environment.baseUrlMonitor;

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    testaRecurso(veiculoId, recurso: string) {
        return this.http.get(this.baseUrl + 'api/v1/veiculo/' + veiculoId + '/verificarpreparacao/' + recurso + '?forcar=true');
    }

    getStatusTestes(veiculoId) {
        let gps = this.http.get(this.baseUrl + 'api/v1/veiculo/' + veiculoId + '/ultimaverificacaoitem/GPS');
        let bloqueio = this.http.get(this.baseUrl + 'api/v1/veiculo/' + veiculoId + '/ultimaverificacaoitem/BLOQUEIO');
        let desbloqueio = this.http.get(this.baseUrl + 'api/v1/Veiculo/' + veiculoId + '/ultimaverificacaoitem/DESBLOQUEIO');
        let blindagem = this.http.get(this.baseUrl + 'api/v1/veiculo/' + veiculoId + '/ultimaverificacaoitem/BLINDAGEM');
        let liberacao = this.http.get(this.baseUrl + 'api/v1/veiculo/' + veiculoId + '/ultimaverificacaoitem/LIBERACAO');
        let carenagem = this.http.get(this.baseUrl + 'api/v1/veiculo/' + veiculoId + '/ultimaverificacaoitem/CARENAGEM');
        return forkJoin([gps, bloqueio, desbloqueio, blindagem, liberacao, carenagem]);
    }

    aprovarTest(veiculoId){
        return this.http.post(this.baseUrl + 'api/v1/veiculo/' + veiculoId + '/prepararaluguel', {} );
    }

    getLocalizacao(veiculoId){
        return this.http.get(this.baseUrl + "api/v1/" + "veiculo/" + veiculoId + "/localizacao")
    }
}