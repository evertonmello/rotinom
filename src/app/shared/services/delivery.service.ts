
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {forkJoin} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DeliveryService {

    private baseUrl = environment.baseUrlMonitor;
    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    getEntregadores(){
        return this.http.get(this.baseUrl + 'api/v1/Delivery/Entregador')
    }

    getEntregadoresByName(name:string){
        return this.http.get(this.baseUrl + 'api/v1/Delivery/Entregador?nome=' + name)
    }
    getEntregadoresById(id:string){
        return this.http.get(this.baseUrl + 'api/v1/Delivery/Entregador?id=' + id)
    }

    getStores(){
        return this.http.get(this.baseUrl + 'api/v1/Delivery/Remetente')
    }

    getBoraBoraItens() {
        let url1 = this.http.get(this.baseUrl + 'api/v1/Delivery/Entregador');
        let url2 = this.http.get(this.baseUrl + 'api/v1/Delivery/Remetente');
        return forkJoin([url1, url2]);
    }

    getBoraBoraItensById(id:string) {
        let url1 = this.http.get(this.baseUrl + 'api/v1/Delivery/Entregador?id='+ id);
        let url2 = this.http.get(this.baseUrl + 'api/v1/Delivery/Remetente?id=' + id);
        return forkJoin([url1, url2]);
    }

    getBoraBoraItensByName(name:string) {
        let url1 = this.http.get(this.baseUrl + 'api/v1/Delivery/Entregador?nome=' + name);
        let url2 = this.http.get(this.baseUrl + 'api/v1/Delivery/Remetente?nome='+ name);
        return forkJoin([url1, url2]);
    }

    getEntregadorDetalhe(id: number){
        return this.http.get(this.baseUrl + 'api/v1/Delivery/Entregador/' + id)
    }

    getStoreDetalhe(id: number){
        return this.http.get(this.baseUrl + 'api/v1/Delivery/remetente/' + id)
    }


}