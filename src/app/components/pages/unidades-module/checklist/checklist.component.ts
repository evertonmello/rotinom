import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MonitorDialog } from 'src/app/shared/dialogs/monitor-dialog';
import { ChecklistService } from 'src/app/shared/services/checklist.service';

@Component({
  selector: 'checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

  @Output() closeEvt = new EventEmitter();
  @Input() veiculo;
  public showLoader = true;
  public loadingGps = false;
  public loadingBloqueio = false;
  public loadingDesbloqueio = false;
  public loadingCarenagem = false;
  public loadingBlindagem = false;
  public loadingLiberacao = false;
  public localizacaoInfo;
  public testesStatus = {
    gps: null,
    bloqueio: null,
    desbloqueio: null,
    carenagem: null,
    blindagem: null,
    liberacao: null
  }
  constructor(private checklistService: ChecklistService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getLocalizacaoInfo();
    this.getStatusTestes();
  }

  testar(recurso) {
    let recusoVar;
    switch (recurso) {
      case 'GPS':
        this.loadingGps = true;
        recusoVar = 'loadingGps';
        break;
      case 'BLOQUEIO':
        this.loadingBloqueio = true;
        recusoVar = 'loadingBloqueio';
        break;
      case 'DESBLOQUEIO':
        this.loadingDesbloqueio = true;
        recusoVar = 'loadingDesbloqueio';
        break;
      case 'CARENAGEM':
        this.loadingCarenagem = true;
        recusoVar = 'loadingCarenagem';
        break;
      case 'BLINDAGEM':
        this.loadingBlindagem = true;
        recusoVar = 'loadingBlindagem';
        break;
      case 'LIBERACAO':
        this.loadingLiberacao = true;
        recusoVar = 'loadingLiberacao';
        break;
      default:
        break;
    }

    this.checklistService.testaRecurso(this.veiculo.id, recurso).subscribe((result:any) => {
      this.showMessage(result);
      this.testesStatus[recurso.toLowerCase()].usuarioEmail = result.dataResult.usuarioEmail;
      this.testesStatus[recurso.toLowerCase()].checkData = result.dataResult.checkData;
      this.testesStatus[recurso.toLowerCase()].sucesso = result.dataResult.sucesso;
      this.getLocalizacaoInfo();
      this[recusoVar] = false;
    },(error)=>{
      this.getLocalizacaoInfo();
      this.testesStatus[recurso.toLowerCase()].sucesso = false;
      this[recusoVar] = false;
    })
  }

  showMessage(result){
    this.showMessageDialog('Erro',result.dataResult.resultado);
  }

  getStatusTestes() {
    this.showLoader = true;
    this.checklistService.getStatusTestes(this.veiculo.id).subscribe((result) => {
      this.testesStatus.gps = result[0]['dataResult'];
      this.testesStatus.bloqueio = result[1]['dataResult'];
      this.testesStatus.desbloqueio = result[2]['dataResult'];
      this.testesStatus.blindagem = result[3]['dataResult'];
      this.testesStatus.liberacao = result[4]['dataResult'];
      this.testesStatus.carenagem = result[5]['dataResult'];
      this.showLoader = false;
    })
  }

  getLocalizacaoInfo(){
    this.showLoader = true;
    this.checklistService.getLocalizacao(this.veiculo.id).subscribe((result:any)=>{
      this.localizacaoInfo = result.dataResult;
      this.showLoader = false;
    })
  }

  aprovar() {
    this.checklistService.aprovarTest(this.veiculo.id).subscribe((result) => {
      this.showMessageDialog('Sucesso!', 'Veículo Aprovado com sucesso')
    })
  }
  close() {
    this.closeEvt.emit();
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
