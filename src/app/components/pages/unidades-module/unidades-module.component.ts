import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteDialog } from 'src/app/shared/dialogs/delete-dialog';
import { MonitorDialog } from 'src/app/shared/dialogs/monitor-dialog';
import { UnidadeService } from 'src/app/shared/services/unidade.service';

@Component({
  selector: 'app-unidades-module',
  templateUrl: './unidades-module.component.html',
  styleUrls: ['./unidades-module.component.scss']
})
export class UnidadesModuleComponent implements OnInit {


  public filtroPlaca;
  public filtroImeiIot;
  public filtroIdIot;
  public filtroTelefoneIot;
  public filtroId;
  public filtroChassi;
  public filtroRenavam;
  public filtroSituacao;
  public filtroOperadora;
  public filtroTelefone;
  public filtroImei;
  public veiculos = [];
  public iots = [];
  public setVeiculoSelecionado;
  public veiculoEdicao;
  public iotEdicao;
  public showNovoVeiculoForm = false;
  public showNovoIotForm = false;
  public showChecklist = false;
  public showLoader = true;
  public showOccModal = false;
  public pagina = 1;
  public iotPagina = 1;
  public veiculosTotal = 0
  public iotsTotal = 0;
  public veiculoSelct;
  @ViewChild('tabGroup') tabGroup;

  constructor(
    private unidadeService: UnidadeService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getVeiculos();
    this.getIots();
  }

  getVeiculos() {
    this.showLoader = true;
    this.unidadeService.getVeiculosUnidade(this.pagina).subscribe((response: any) => {
      this.veiculos = this.veiculos.concat(response.dataResult.list);
      this.veiculosTotal = response.dataResult.totalItems;
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;
    })
  }

  onScroll(){
    if(this.tabGroup.selectedIndex == 0){
      this.pagina++
      this.getVeiculos();
    }else{
      this.iotPagina++
      this.getIots();
    }

  }

  getIots() {
    this.showLoader = true;
    this.unidadeService.getIotsUnidade(this.iotPagina).subscribe((response: any) => {
      this.iots = this.iots.concat(response.dataResult.list);
      this.iotsTotal = response.dataResult.totalItems;
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;
    })
  }

  abrirCheckList() {

  }

  openOccurrence(veiculo){
    this.showOccModal = true;
    this.veiculoSelct = veiculo;
  }

  deletar(veiculo) {
    let ref = this.dialog.open(DeleteDialog, {
      width: '500px',
      disableClose: true,
      data: {
        data: null,
        message: {
          title: 'Veículo',
          body: 'o veículo ' + veiculo.placa
        }
      }
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.unidadeService.removerVeiculo(veiculo).subscribe((response) => {
          this.getVeiculos();
          this.showMessageDialog('Sucesso!', 'Veículo deletado com sucesso')
        })
      }
    })
  }

  deletarIot(iot) {
    let ref = this.dialog.open(DeleteDialog, {
      width: '500px',
      disableClose: true,
      data: {
        data: null,
        message: {
          title: 'Iot',
          body: 'o dispositivo ' + iot.imei
        }
      }
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.unidadeService.removerIot(iot.id).subscribe((response) => {
          this.getIots();
          this.showMessageDialog('Sucesso!', 'Dispositivo deletado com sucesso')
        })
      }
    })
  }


  getVeiculosComFiltro() {
    this.showLoader = true;
    let paramUrl = "";

    if (this.filtroPlaca) {
      paramUrl = "placa=" + this.filtroPlaca;
    }
    if (this.filtroRenavam) {
      paramUrl = paramUrl ? paramUrl + "&renavam=" + this.filtroRenavam : "renavam=" + this.filtroRenavam;
    }
    if (this.filtroChassi) {
      paramUrl = paramUrl ? paramUrl + "&chassi=" + this.filtroChassi : "chassi=" + this.filtroChassi;
    }
    if (this.filtroId) {
      paramUrl = paramUrl ? paramUrl + "&id=" + this.filtroId : "id=" + this.filtroId;
    }

    if (this.filtroSituacao) {
      paramUrl = paramUrl ? paramUrl + "&filtro=" + this.filtroSituacao : "filtro=" + this.filtroSituacao;
    }

    this.unidadeService.getVeiculosUnidadeComFiltro(paramUrl).subscribe((response: any) => {
      this.veiculos = response.dataResult.list;
      this.veiculosTotal = response.dataResult.totalItems;
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;
    })
  }

  desvincular(iot){
    this.unidadeService.desvincularIot(iot.id).subscribe((resp)=>{
      this.showMessageDialog('Sucesso', 'Iot desvinculado com sucesso')
    })
  }
  
  getIotssComFiltro() {
    this.showLoader = true;
    let paramUrl = "";

    if(this.filtroIdIot){
      paramUrl = "/" + this.filtroIdIot;
    }

    if (this.filtroImeiIot) {
      paramUrl = "?imei=" + this.filtroImeiIot;
    }

  

    this.unidadeService.getIotUnidadeComFiltro(paramUrl).subscribe((response: any) => {
      this.iots = response.dataResult.list || [response.dataResult] ;
      this.iotsTotal = response.dataResult.totalItems;
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;
    })
  }


  geoLocation(veiculo) {
    this.router.navigate(['monitor/' + veiculo.placa])
  }

  editar(veiculo) {
    this.veiculoEdicao = veiculo;
    this.showNovoVeiculoForm = true;
  }

  editarIot(iotEdicao) {
    this.iotEdicao = iotEdicao;
    this.showNovoIotForm = true;
  }

  closeAndUpdateVeiculo(){
    this.getVeiculos();
    this.showNovoVeiculoForm = false;
    this.veiculoEdicao = null;
  }


  closeAndUpdateIot(){
    this.getIots();
    this.showNovoIotForm = false;
    this.iotEdicao = null;
  }
  showMessageDialog(title, body) {
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
