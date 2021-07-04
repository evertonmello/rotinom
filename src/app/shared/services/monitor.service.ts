import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MonitorService {
  
    private baseUrl = environment.baseUrl;
    private baseUrlMonitor = environment.baseUrlMonitor;
    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    getVeiculos(placa) {
        return this.http.get(this.baseUrlMonitor + 'api/v1/veiculo/mapa?placa=' + placa)
    }

    atualizaVeiculos() {
        return this.http.get(this.baseUrlMonitor + 'api/v1/veiculo/localizacoes?padrao=nomeado')
    }

    previaAlertas(veiculoId){
        return this.http.get(this.baseUrlMonitor + 'api/v1/veiculo/' + veiculoId + '/ultimoAlerta' )
    }

    getAlertas(filtro:string){
        return this.http.get(this.baseUrlMonitor + 'api/v1/veiculoalerta/' + filtro  )
    }

    bloquearAlerta(veiculodId){
        return this.http.post(this.baseUrlMonitor + 'api/v1/veiculo/' + veiculodId + '/bloquear', {} )
    }

    resolverAlerta(veiculoAlertaId, comentario){
        return this.http.get(this.baseUrlMonitor  + 'api/v1/veiculoalerta/' + veiculoAlertaId + '/resolver?comentario=' + comentario,{})
    }

    recolherVeiculo(payload){
        return this.http.post(this.baseUrl + 'cs/ticket',payload )
    }

    bloquearVeiculo(veiculoSelecionadoId){
        return this.http.post(this.baseUrlMonitor + 'api/v1/OrdemBloqueioDesbloqueio', veiculoSelecionadoId )
    }
    desbloquearVeiculo(veiculoSelecionadoId){
        return this.http.post(this.baseUrlMonitor + 'api/v1/veiculo/' + veiculoSelecionadoId + '/desbloquear', {} )
    }    


    desbloquearTemporarioVeiculo(blockPayload){
        return this.http.post(this.baseUrlMonitor + 'api/v1/OrdemBloqueioDesbloqueio/temporario', blockPayload )
    }   
    getVeiculosSuport(){
        return this.http.get(this.baseUrlMonitor + 'api/v1/VeiculoSuporte')
    }
    getVeiculosReservaLocalizacoes(){
        return this.http.get(this.baseUrlMonitor + 'api/v1/veiculo/localizacoes?padrao=nomeado&reserva=true')
    }    

    getVehicleBasicInfo(){
        return this.http.get(this.baseUrlMonitor + 'api/v1/veiculo/resumos')
    }

    getVeiculosHistoricoLocalizacao(veiculodId, dataInicio, dataFim){
        return this.http.get(this.baseUrlMonitor + 'api/v1/Veiculo/' + veiculodId + '/historicoLocalizacao?inicioData=' + dataInicio + "&fimData=" +  dataFim )
    }   

    getLocalizacaoVeiculo(veiculoId){
        return this.http.get(this.baseUrlMonitor + 'api/v1/veiculo/' + veiculoId + '/localizacao?padrao=nomeado'  )
    }

    getVeiculosSuporteLocalizacoes(){
        return this.http.get(this.baseUrlMonitor + 'api/v1/VeiculoSuporte/localizacao' )
    }


    getHistoricoBlock(veiculoId){
        return this.http.get(this.baseUrlMonitor + 'api/v1/ordembloqueiodesbloqueio/historico?veiculoId=' + veiculoId )
    }

    cancelaOrdem(ordemId){
        return this.http.delete(this.baseUrlMonitor + 'api/v1/ordembloqueiodesbloqueio?ordemId=' + ordemId )
    }

    vincularUserVeiculo(userId,veiculoSuporteId){
        return this.http.post(this.baseUrlMonitor + 'api/v1/UsuarioSuporte/' + userId + '/veiculo/' + veiculoSuporteId + '/ingressar' , {} )
    }
    
}