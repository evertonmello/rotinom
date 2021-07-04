import { Input, Output } from '@angular/core';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MonitorDialog } from 'src/app/shared/dialogs/monitor-dialog';
import { OccurrenceService } from 'src/app/shared/services/occurrence.service';
import * as moment from 'moment';

@Component({
  selector: 'app-ocorrencias',
  templateUrl: './ocorrencias.component.html',
  styleUrls: ['./ocorrencias.component.scss']
})
export class OcorrenciasComponent implements OnInit {

  @Input() veiculoSelct;
  @Output() closeEvt = new EventEmitter();
  public occurrenceSelected;
  public dataComunicacao;
  public dataOcorrencia;
  public ocorrenciaAtual;
  public showLoader = false;
  public acidentForm: FormGroup = new FormGroup({
    nomeTerceiro: new FormControl('', Validators.required),
    placaTerceiro: new FormControl('', Validators.required),
    corCarroTerceiro: new FormControl('', Validators.required),
    modeloCarroTerceiro: new FormControl('', Validators.required),
    docBo: new FormControl(''),
    docTerceiro: new FormControl(''),
    docVeicTerc: new FormControl('')
  });
  public file;
  public docTerceiro;
  public docVeicTerc;
  public ocorrenciaUpdateForm: FormGroup = new FormGroup({
    dataRecuperacao: new FormControl('', Validators.required),
    rua: new FormControl('', Validators.required),
    numero: new FormControl('', Validators.required),
    cidade: new FormControl('', Validators.required),
    uf: new FormControl('', Validators.required),
    bairro: new FormControl('', Validators.required),
    complemento: new FormControl(''),
    custoRecuperacao: new FormControl('', Validators.required)
  });

  public showOccurrenceIni = true;
  public occurrences = [
    {
      label: "Roubo"
    },
    {
      label: "Furto"
    },
    {
      label: "Acidente"
    },
    {
      label: "Apreensao"
    },
    {
      label: "Retida"
    },
  ]
  constructor(private occurrenceService: OccurrenceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getStatusOcorrencia();
  }

  addNewOcorrencia() {
    this.showLoader = true;

    let occurrence = {
      "idVeiculo": this.veiculoSelct.id,
      "dataOcorrencia": this.dataOcorrencia.toISOString(),
      "dataComunicacao": this.dataComunicacao.toISOString(),
      "ocorrenciaTipo": this.occurrenceSelected,
      "dataRecuperacao": null
    }

    this.occurrenceService.addOcorrencia(this.veiculoSelct.id, 1, occurrence).subscribe((res: any) => {
      this.showLoader = false;
      this.showMessage('Sucesso', 'Ocorrencia registrada com sucesso');
      this.close();
    }, (error) => {
      this.showLoader = false;
      this.showMessage('Erro', JSON.stringify(error))
    })
  }

  getStatusOcorrencia() {
    this.showLoader = true;
    this.occurrenceService.getOcorrencia(this.veiculoSelct.id).subscribe((res: any) => {
      this.ocorrenciaAtual = res.dataResult;
      if (this.ocorrenciaAtual) {
        this.checkDetailInfo();
      } else {
        this.showLoader = false;
      }
    }, () => {
      this.showLoader = false;
    })
  }

  checkDetailInfo() {
    if (this.ocorrenciaAtual.dataRecuperacao) {
      this.ocorrenciaUpdateForm.controls.dataRecuperacao.setValue(this.ocorrenciaAtual.dataRecuperacao)
    }
    if (this.ocorrenciaAtual.custoRecuperacao) {
      this.ocorrenciaUpdateForm.controls.custoRecuperacao.setValue(this.ocorrenciaAtual.custoRecuperacao)
    }

    if (this.ocorrenciaAtual.endereco) {
      this.ocorrenciaUpdateForm.controls.endereco.setValue(this.ocorrenciaAtual.endereco)
    }

    if (this.ocorrenciaAtual.nomeTerceiro) {
      this.acidentForm.controls.nomeTerceiro.setValue(this.ocorrenciaAtual.nomeTerceiro)
    }
    if (this.ocorrenciaAtual.placaTerceiro) {
      this.acidentForm.controls.placaTerceiro.setValue(this.ocorrenciaAtual.placaTerceiro)
    }

    if (this.ocorrenciaAtual.corCarroTerceiro) {
      this.acidentForm.controls.corCarroTerceiro.setValue(this.ocorrenciaAtual.corCarroTerceiro)
    }

    if (this.ocorrenciaAtual.modeloCarroTerceiro) {
      this.acidentForm.controls.modeloCarroTerceiro.setValue(this.ocorrenciaAtual.modeloCarroTerceiro)
    }
    this.showLoader = false;
  }

  fileChange(event,docType){
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    this.file = formData;
    this.enviar(docType);
  }


  enviar(docType){
    this.occurrenceService.enviarArquivos(this.veiculoSelct.id, this.file,docType).subscribe((resp:any)=>{
        this.showMessage('Sucesso', 'Arquivo enviado com sucesso')
    },(erro)=>{ 
        this.showMessage('Erro', erro) 
    })
  }


  updateOcorrencia() {
    this.showLoader = true;
    let ocorrencia = this.ocorrenciaUpdateForm.value;
    this.occurrenceService.updateOcorrencia(this.veiculoSelct.id, ocorrencia).subscribe((res: any) => {
      this.showLoader = false;
      this.showMessage('Sucesso', 'Dados registrados com sucesso');
      this.close();
    }, () => {
      this.showLoader = false;
    })
  }

  updateOcorrenciaAcidadente() {
    this.showLoader = true;
    let ocorrencia = this.acidentForm.value;
    this.occurrenceService.updateOcorrencia(this.veiculoSelct.id, ocorrencia).subscribe((res: any) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  close() {
    this.closeEvt.emit();
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
