
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpBackend, HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ResgateService {

    private baseUrl = environment.baseUrlMonitor;
    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    getHistoricoVeiculos(horas:number,veiculoId:number) {
        return this.http.get(this.baseUrl + 'api/v1/Veiculo/ConsultarEnderecosPercorridos/' + veiculoId + '/' + horas)
    }

    getVeiculoResgateById(id){
        return this.http.get(this.baseUrl + 'api/v1/VeiculoResgate/' + id)
    }

    getVeiculosParaResgate() {
        return this.http.get(this.baseUrl + 'api/v1/VeiculoResgate')
    }

    getVeiculosParaResgateFiltered(filter:string) {
        return this.http.get(this.baseUrl + 'api/v1/VeiculoResgate?' + filter)
    }

    finalizarResgate(veiculoId:number){
        return this.http.post(this.baseUrl + 'api/v1/VeiculoResgate/' + veiculoId + '/situacao/3', {});
    }

    criaAgendamentoResgate(resgate:any){
        return this.http.post(this.baseUrl + 'api/v1/VeiculoResgate',resgate)
    }

    estimaSuporte(veiculoId){
        return this.http.post(this.baseUrl + 'api/v1/VeiculoResgate/' + veiculoId + '/estimarsuporte', {})
    }

    rejeitar(veiculoId, observacao){
        return this.http.post(this.baseUrl + 'api/v1/VeiculoResgate/' + veiculoId + '/rejeitar', {observacao: observacao})
    }

    cancelarServico(veiculoId, observacao){
        return this.http.post(this.baseUrl + 'api/v1/VeiculoResgate/' + veiculoId + '/cancelar', {observacao: observacao})
    }

    getVeiculosSuporte() {
        return this.http.get(this.baseUrl + 'api/v1/VeiculoResgate/board')
    }

    escalar(id,veiculoSuporteId, ordem){
        return this.http.post(this.baseUrl + 'api/v1/VeiculoResgate/' + id + '/escalar?veiculoSuporteId=' + veiculoSuporteId +'&ordem=' + ordem, {})
    }

    encerrarServico(id){
        return this.http.post(this.baseUrl + 'api/v1/VeiculoResgate/' + id + '/encerrar', {})
    }

    trocaMoto(id, troca = false){                                                                         
        return this.http.patch(this.baseUrl + 'api/v1/VeiculoResgate/' + id + '/troca/'+ troca, {}) 
    }

    iniciaAtendimento(id){
        return this.http.post(this.baseUrl + 'api/v1/VeiculoResgate/' + id + '/atender', {})
    }

    iniciaDeslocamento(id){
        return this.http.post(this.baseUrl + 'api/v1/VeiculoResgate/' + id + '/iniciarDeslocamento', {})
    }

    aceitarServico(id){
        return this.http.post(this.baseUrl + 'api/v1/VeiculoResgate/' + id + '/aceitar', {})
    }

    cancelaDeslocamento(id){
        return this.http.post(this.baseUrl + 'api/v1/VeiculoResgate/' + id + '/cancelarDeslocamento', {})
    }

    addServiceItem(serviceItem){
        return this.http.post(this.baseUrl + 'api/v1/VeiculoResgate/item', serviceItem)
    }

    getServiceItens(veiculoResgateId){
        return this.http.get(this.baseUrl + 'api/v1/VeiculoResgate/' + veiculoResgateId + '/item')
    }

    removeServiceItem(id){
        return this.http.delete(this.baseUrl + 'api/v1/VeiculoResgate/item/' + id, {})
    }

    getLocatarioInfo(locatarioId){
        return this.http.get(this.baseUrl + 'api/v1/Locatario/' + locatarioId )
    }

    enviarArquivos(id, formData){
        return this.http.post(this.baseUrl + 'api/v1/VeiculoResgate/' + id +'/atendimento/arquivo', formData )
    }

    removeArquivo(fileId){
        return this.http.delete(this.baseUrl + 'api/v1/VeiculoResgate/atendimento/arquivo/' + fileId)
    }

    getArquivosServico(id){
        return this.http.get(this.baseUrl + 'api/v1/VeiculoResgate/' + id +'/atendimento/arquivo' )
    }
    
}