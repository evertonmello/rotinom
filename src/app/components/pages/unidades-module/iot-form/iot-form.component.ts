import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MonitorDialog } from 'src/app/shared/dialogs/monitor-dialog';
import { UnidadeService } from 'src/app/shared/services/unidade.service';

@Component({
  selector: 'app-iot-form',
  templateUrl: './iot-form.component.html',
  styleUrls: ['./iot-form.component.scss']
})
export class IotFormComponent implements OnInit {

  public iotForm: FormGroup;
  public showLoader = false;
  public placasSemIot;
  public placasValues;
  public placaSelected;
  @Input() iot;
  @Output() closeEvt = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private unidadeService: UnidadeService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getPlacasSemIot();
    this.iotForm = this.fb.group({
      imei: [{value: this.iot?.imei || '', disabled: this.iot? true: false}],
      telefone:[this.iot?.telefone || ''],
      telefoneOperadora:[this.iot?.telefoneOperadora || ''],
      veiculoId:[this.iot?.veiculoPlaca],
      Modelo:[this.iot?.modelo || '']
    });
  }
  close() {
    this.closeEvt.emit();
  }

  getPlacasSemIot(){
    this.unidadeService.getPlacasSemIot().subscribe((response:any)=>{
      this.placasSemIot = response.dataResult.list;
      this.placasValues = this.placasSemIot;
    });
  }

  save() {
    this.showLoader = true;
    if (this.iot) {
      this.editarIot();
    } else {
      this.cadastrarIot();
    }
  }

  public _filter(value) {
    if (value == '') {
      this.placasValues = this.placasSemIot;
      this.placaSelected = null;
    } else {
      const filterValue = value.toLowerCase();
      this.placasValues = this.placasSemIot.filter(option => {
        if (option.placa) {
          return option.placa.toLowerCase().includes(filterValue) == true;
        }
      });
    }
  }

  cadastrarIot() {
    let iot = this.iotForm.value;
    this.unidadeService.addIot(iot).subscribe((response) => {
      this.showMessageDialog('Sucesso!', 'Dispositivo cadastrado com sucesso');
      this.showLoader = false;
      this.closeEvt.emit();
    }, (error) => {
      this.showLoader = false;
    })
  }

  editarIot() {
    let iot = this.iotForm.value;
    iot['imei'] = this.iot.imei;
    let id = this.iot.id;
    this.unidadeService.editarIot(id,iot).subscribe((response) => {
      this.showLoader = false;
      this.showMessageDialog('Sucesso!', 'Dispositivo editado com sucesso')
      this.closeEvt.emit();
    }, (error) => {
      this.showLoader = false;
    });

    //manda pra vincular apenas se a placa selecionada for diferente da inicial
    if(iot.veiculoId && iot.veiculoId != this.iot?.veiculoPlaca){
      this.unidadeService.vincularIot(this.iot.id,iot.veiculoId).subscribe((resp:any)=>{
      },(error)=>{
        this.showMessageDialog('Erro', '')
      })
    }
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
