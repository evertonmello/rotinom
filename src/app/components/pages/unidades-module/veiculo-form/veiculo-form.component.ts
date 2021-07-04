import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UnidadeService } from 'src/app/shared/services/unidade.service';
import { MonitorDialog } from 'src/app/shared/dialogs/monitor-dialog';

@Component({
  selector: 'app-veiculo-form',
  templateUrl: './veiculo-form.component.html',
  styleUrls: ['./veiculo-form.component.scss']
})
export class VeiculoFormComponent implements OnInit {

  public showLoader = false;
  public veiculoForm: FormGroup;
  @Input() veiculo;
  @Output() closeEvt = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private unidadeService: UnidadeService,
    public dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.setVeiculoForm();
  }

  setVeiculoForm() {
    this.veiculoForm = this.fb.group({
      criacaoData: [''],
      delecaoData: [''],
      placa: [{value: this.veiculo?.placa || '', disabled: this.veiculo? true: false}],
      precoCategoriaId: [''],
      chassi: [{value: this.veiculo?.chassi || '', disabled: this.veiculo? true: false}],
      renavam: [{value: this.veiculo?.renavam || '', disabled: this.veiculo? true: false}],
      anoFabricacao: [''],
      anoModelo: [''],
      documento: [''],
      cor: [this.veiculo?.cor || ''],
      veiculoModeloId: [''],
      iotId: [this.veiculo?.iotId || ''],
      situacao: [''],
      kms: [''],
      outputIot: [this.veiculo?.outputIot || ''],
      notaFiscalNumero: [''],
      notaFiscalUrl: [''],
      teste: [''],
      documentoUrl: [''],
      sensorMagnetico: ['']
    })
  }

  close() {
    this.closeEvt.emit();
  }

  cadastrarVeiculo() {
    let veiculo = this.veiculoForm.value;
    this.unidadeService.addVeiculo(veiculo).subscribe((response) => {
      this.showMessageDialog('Sucesso!', 'Veículo cadastrado com sucesso');
      this.showLoader = false;
      this.closeEvt.emit();

    }, (error) => {
      this.showLoader = false;
    })
  }

  editarVeiculo() {
    let veiculo = this.veiculoForm.value;
    let id = this.veiculo.id;
    this.unidadeService.editarVeiculo(id,veiculo).subscribe((response) => {
      this.showLoader = false;
      this.showMessageDialog('Sucesso!', 'Veículo editado com sucesso')
      this.closeEvt.emit();
    }, (error) => {
      this.showLoader = false;
    })
  }

  save() {
    this.showLoader = true;
    if (this.veiculo) {
      this.editarVeiculo();
    } else {
      this.cadastrarVeiculo();
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
