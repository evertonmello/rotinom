import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MonitorDialog } from 'src/app/shared/dialogs/monitor-dialog';
import { ResgateService } from 'src/app/shared/services/regate.service';

@Component({
  selector: 'app-resgate-form',
  templateUrl: './resgate-form.component.html',
  styleUrls: ['./resgate-form.component.scss']
})
export class ResgateFormComponent implements OnInit {

  public resgateForm: FormGroup;
  public showLoader = false;
  public motivosSuportCampo =
    [
      { value: 2, label: 'Acidente' },
      { value: 4, label: 'Chave perdida' },
      { value: 5, label: 'Problema elétrico' },
      { value: 6, label: 'Problema mecânico' },
      { value: 10, label: 'Roda dianteira' },
      { value: 9, label: 'Roda traseira' },
      { value: 11, label: 'Tentativa de roubo' }
    ];

  public motivosSuporteRecolhimentio =
    [
      { value: 15, label: 'Acidente' },
      { value: 18, label: 'Apoio' },
      { value: 17, label: 'Delegacia de Polícia' },
      { value: 7, label: 'Inadimplência' },
      { value: 8, label: 'Manutenção' },
      { value: 3, label: 'Mau uso' },
      { value: 12, label: 'Multa de trânsito' },
      { value: 16, label: 'Pátio' },
      { value: 13, label: 'Solicitação' }
      
    ];

  @Input() veiculoData;
  @Output() closeResgateForm = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private resgateService: ResgateService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.resgateForm = this.fb.group({
      UsarOutraLocalizacao: [true],
      dataAgendamento: [''],
      idExterno: [''],
      veiculoResgateTipoId: ['', Validators.required],
      servico: [1, Validators.required],
      observacao: [''],
      prioridade: ['',Validators.required],
      enderecoRua: new FormControl({ value: '', disabled: true }, [Validators.required]),
      enderecoNumero: new FormControl({ value: '', disabled: true }, [Validators.required]),
      enderecoBairro: new FormControl({ value: '', disabled: true }, [Validators.required]),
      enderecoCidade: new FormControl({ value: '', disabled: true }, [Validators.required]),
      enderecoEstado: new FormControl({ value: '', disabled: true }, [Validators.required]),
      enderecoComplemento: new FormControl({ value: '', disabled: true })
    });
  }

  setMotoEndereco() {
    let localizacaoAtual = this.resgateForm.controls.UsarOutraLocalizacao.value;

    localizacaoAtual ? this.resgateForm.controls.enderecoRua.disable() : this.resgateForm.controls.enderecoRua.enable();
    localizacaoAtual ? this.resgateForm.controls.enderecoNumero.disable() : this.resgateForm.controls.enderecoNumero.enable();
    localizacaoAtual ? this.resgateForm.controls.enderecoBairro.disable() : this.resgateForm.controls.enderecoBairro.enable();
    localizacaoAtual ? this.resgateForm.controls.enderecoCidade.disable() : this.resgateForm.controls.enderecoCidade.enable();
    localizacaoAtual ? this.resgateForm.controls.enderecoEstado.disable() : this.resgateForm.controls.enderecoEstado.enable();
    localizacaoAtual ? this.resgateForm.controls.enderecoComplemento.disable() : this.resgateForm.controls.enderecoComplemento.enable();
  }

  criaNovoResgate() {
    this.showLoader = true;
    let resgatePayload = this.resgateForm.value;
    resgatePayload.veiculoId = this.veiculoData.id;
    resgatePayload.locatarioId = this.veiculoData.veiculoLocatarioId;
    this.resgateForm.controls.UsarOutraLocalizacao.setValue(!this.resgateForm.controls.UsarOutraLocalizacao.value);

    this.resgateService.criaAgendamentoResgate(resgatePayload).subscribe((response: any) => {
      this.closeResgateForm.emit();
      this.showLoader = false;
      this.showMessage('Sucesso', 'Agendamento de Resgate criado com sucesso ')
    })
  }

  closeForm() {
    this.closeResgateForm.emit();
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
