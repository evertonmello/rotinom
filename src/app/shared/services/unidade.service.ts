
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UnidadeService {

    private baseUrl = environment.baseUrlMonitor;
    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    getIotsUnidade(pagina){
        return this.http.get(this.baseUrl + 'api/v1/Iot?itens=100&pagina='+pagina)
    }

    getIotUnidadeComFiltro(params:String){
        return this.http.get(this.baseUrl + 'api/v1/Iot' + params)
    }

    getVeiculosUnidade(pagina){
        return this.http.get(this.baseUrl + 'api/v1/Veiculo?itens=100&pagina='+pagina)
    }

    getVeiculosUnidadeComFiltro(params:String){
        return this.http.get(this.baseUrl + 'api/v1/Veiculo?' + params)
    }

    addVeiculo(veiculo){
        return this.http.post(this.baseUrl + 'api/v1/Veiculo', veiculo)
    }

    addIot(iot){
        return this.http.post(this.baseUrl + 'api/v1/Iot', iot)
    }

    editarIot(id, iot){
        return this.http.patch(this.baseUrl + 'api/v1/Iot/'+ id, iot)
    }

    removerIot(id){
        return this.http.delete(this.baseUrl + 'api/v1/Iot/'+ id, {})
    }

    removerVeiculo(veiculo){
        return this.http.delete(this.baseUrl + 'api/v1/Veiculo/' + veiculo.id)
    }

    editarVeiculo(id, veiculo){
        return this.http.patch(this.baseUrl + 'api/v1/Veiculo/' + id, veiculo)
    }

    getPlacasSemIot(){
        return this.http.get(this.baseUrl + 'api/v1/Veiculo?filtro=semiot')
    }

    desvincularIot(iotId){
        return this.http.patch(this.baseUrl + "api/v1/veiculo/Desvinculariot/" + iotId, {})
    }
    vincularIot(iotId, veiculoId){
        return this.http.patch(this.baseUrl + "api/v1/veiculo/vinculariot/" + iotId + "/" + veiculoId, {})
    }


}