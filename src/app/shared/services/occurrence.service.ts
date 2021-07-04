
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {forkJoin} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OccurrenceService {

    private baseUrl = environment.baseUrlMonitor;
    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    addOcorrencia(id, situacao, ocorrencia){
        return this.http.post(this.baseUrl + 'api/v1/Veiculo/' + id +'/ocorrencia/' + situacao, ocorrencia)
    }

    getOcorrencia(veiculoId){
        return this.http.get(this.baseUrl + 'api/v1/Veiculo/' + veiculoId +'/ocorrencia')
    }


    updateOcorrencia(veiculoId,ocorrencia){
        return this.http.put(this.baseUrl + 'api/v1/Veiculo/' + veiculoId +'/ocorrencia', ocorrencia)
    }

    enviarArquivos(id, formData,docType){
        return this.http.post(this.baseUrl + 'api/v1/Veiculo/' + id +'/ocorrencia/arquivo/' + docType, formData )
    }

}