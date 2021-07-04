import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MonitorService } from 'src/app/shared/services/monitor.service';

@Component({
  selector: 'app-block-modal',
  templateUrl: './block-modal.component.html',
  styleUrls: ['./block-modal.component.scss']
})
export class BlockModalComponent implements OnInit {

  public showLoader = true;
  public motivo;
  @Input()veiculoSelecionado;
  @Input()oneHourBlock;
  @Output() getV = new EventEmitter();
  @Output() setModalView = new EventEmitter();
  
  constructor(
    private monitorService: MonitorService
  ) { }

  ngOnInit(): void {
  }

  bloquear() {
    this.showLoader = true;
    let blockPayload = {
      VeiculoId: this.veiculoSelecionado['id'],
      Tipo: "1",
      Origem: this.motivo
    }
    this.monitorService.bloquearVeiculo(blockPayload).subscribe((response: any) => {
      this.showLoader = false;
      this.getV.emit();
    }, (error) => {
      this.showLoader = false;
    })
  }

  desbloquear() {
    var blockPayload = {
      VeiculoId: this.veiculoSelecionado['id'],
      Tipo: "2",
      Origem: this.motivo
    }

    if (this.oneHourBlock) {
      this.desbloqueio1HService(blockPayload);
    } else {
      this.desbloqueioService(blockPayload);
    }
  }

  desbloqueioService(blockPayload) {
    this.showLoader = true;
    this.monitorService.bloquearVeiculo(blockPayload).subscribe((response: any) => {
      this.showLoader = false;
      this.getV.emit();
    }, (error) => {
      this.showLoader = false;
    })
  }

  desbloqueio1HService(blockPayload) {
    this.showLoader = true;
    this.monitorService.desbloquearTemporarioVeiculo(blockPayload).subscribe((response: any) => {
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;
    })
  }

  cancelar() {
    this.getV.emit();
  }

}
