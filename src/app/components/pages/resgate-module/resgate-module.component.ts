import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { MonitorDialog } from 'src/app/shared/dialogs/monitor-dialog';
import { MonitorService } from 'src/app/shared/services/monitor.service';
import { ResgateService } from 'src/app/shared/services/regate.service';

declare var google: any;

@Component({
  selector: 'app-resgate-module',
  templateUrl: './resgate-module.component.html',
  styleUrls: ['./resgate-module.component.scss']
})
export class ResgateModuleComponent implements OnInit {

  public veiculos;
  public locale = {
    applyLabel: 'Confirmar',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
  }
  public zoom = 10;
  public lat: number = -23.5997058;
  public lng: number = -46.3043523;
  public google = google || null;
  public dataSelecionada;
  public showDetalhe = false;
  public carregadoAlerta = true;
  public veiculoHistorico;
  public veiculoSelecionado;
  public showLoader = true;
  public violacoes;
  public veiculosSuporte;
  public showVeiculosSuporte = false;
  public semVeiculosPresgate = false;
  public origin = { lat: 0, lng: 0 };
  public dest = { lat: 0, lng: 0 };
  public wayPointsMap = [];
  public showRoute = false;
  public showEstimarLoader = false;
  constructor
  (
    private resgateService: ResgateService,
    private monitorService: MonitorService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.searchVeiculo();
    this.getVeiculosSuporte();
  }

  searchVeiculo() {
    this.resgateService.getVeiculosParaResgate().subscribe((response: any) => {
      this.veiculos = response.dataResult;
      this.countVeiculosParaResgate();
      this.showLoader = false;
    })
  }

  estimarSuporte(){
    this.showEstimarLoader = true;
    this.resgateService.estimaSuporte(this.veiculoSelecionado.id).subscribe((resp:any)=>{
      this.veiculosSuporte = resp.dataResult;
      this.showVeiculosSuporte = true;
      this.showEstimarLoader = false;
    })
  }

  countVeiculosParaResgate(){
    if(!this.veiculos.find(item => item.situacao == 0) && 
    !this.veiculos.find(item => item.situacao == 1) && 
    !this.veiculos.find(item => item.situacao == 2)){
        this.semVeiculosPresgate = true;
    }
  }

  selectVeiculo(veiculo) {
    this.veiculoSelecionado = veiculo;
    this.getDetalheVeiculos(6);
    this.getAlertas();
    this.getVeiculoResgateById();
    this.zoom = 18;
    this.lat = this.veiculoSelecionado.enderecoLatitude;
    this.lng = this.veiculoSelecionado.enderecoLongitude + 0.002;
  }

  getDetalheVeiculos(horas: number) {
    this.showLoader = true;
    this.resgateService.getHistoricoVeiculos(horas,this.veiculoSelecionado.veiculoId).subscribe((response: any) => {
      this.veiculoHistorico = response.dataResult;
      this.showDetalhe = true;
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;
    })
  }

  getVeiculoResgateById(){
    this.resgateService.getVeiculoResgateById(this.veiculoSelecionado.id).subscribe((response: any) => {
      this.veiculoSelecionado = response.dataResult;
      this.dest.lat = this.veiculoSelecionado.enderecoLatitude;
      this.dest.lng = this.veiculoSelecionado.enderecoLongitude;
    })
  }
  

  getAlertas() {
    this.showLoader = true;
    this.monitorService.getAlertas('30?placa=' + this.veiculoSelecionado.veiculoPlaca).subscribe((response: any) => {
      this.violacoes = response.dataResult;
      this.showLoader = false;
    })
  }

  bloquear() {
    this.showLoader = true;
    this.monitorService.bloquearVeiculo(this.veiculoSelecionado).subscribe((response: any) => {
      this.showLoader = false;
      this.showMessage('Sucesso', 'Bloqueado com sucesso');
    })
  }

  getVeiculosSuporte(){
    this.monitorService.getVeiculosSuport().subscribe((resp:any)=>{
      this.veiculosSuporte = resp.dataResult;
    })
  }

  finalizar() {
    this.showLoader = true;
    this.resgateService.finalizarResgate(this.veiculoSelecionado.id).subscribe((response) => {
      this.showLoader = false;
      this.showMessage('Sucesso', 'Finalizado com sucesso');
    })
  }

  setRoute(veiculoSpt){
    this.origin.lat = veiculoSpt.latitude;
    this.origin.lng = veiculoSpt.longitude;
    this.dest.lat = this.veiculoSelecionado.enderecoLatitude;
    this.dest.lng = this.veiculoSelecionado.enderecoLongitude;
    this.showRoute = true;
  }

  showMessage(title, body) {
    this.dialog.open(MonitorDialog, {
      width: '500px',
      data: {
        data: -1,
        message: {
          title: title,
          body: body
        }
      }
    });
  }

}
