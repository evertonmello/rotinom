import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddServiceDialog } from 'src/app/shared/dialogs/add-service-dialog';
import { GaleryDialog } from 'src/app/shared/dialogs/galery-dialog';
import { ImageDialog } from 'src/app/shared/dialogs/image-dialog';
import { MonitorDialog } from 'src/app/shared/dialogs/monitor-dialog';
import { ServicoDialog } from 'src/app/shared/dialogs/servico-dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ResgateService } from 'src/app/shared/services/regate.service';
import { SupportService } from 'src/app/shared/services/support.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  @Input() veiculosResgate;
  public novosFilter = true;
  public encaminhadosFilter;
  public showEmpty = true;
  public atendidosFilter;
  public servicoSelecionado;
  public showDetail = false;
  public showLoader = false;
  public showListLoader = false;
  public userStatus;
  public isOnline;
  public suportUser = JSON.parse(localStorage.getItem('veiculoSelecionado'));

  constructor(
    private dialog: MatDialog,
    private resgateService: ResgateService,
    private supportService: SupportService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.getOnlineStatus();
  }
  select(servico) {
    this.servicoSelecionado = servico;
    this.showDetail = true;
  }

  getVeiculosResgate() {
    this.showListLoader = true;
    this.resgateService.getVeiculosParaResgate().subscribe((veiculosResgate: any) => {
      this.veiculosResgate = veiculosResgate.dataResult;
      this.showDetail = false;
      this.showListLoader = false;
    },()=>{
      this.showListLoader = false;
    });
  }


  atualizaServico() {
    this.resgateService.getVeiculoResgateById(this.servicoSelecionado.id).subscribe((res: any) => {
      this.servicoSelecionado = res.dataResult;
    })
  }
  openRejeitaModal() {
    this.dialog.open(ServicoDialog, {
      width: '500px',
      data: this.servicoSelecionado
    });
  }

  addServico() {
    this.dialog.open(AddServiceDialog, {
      width: '500px',
      data: this.servicoSelecionado
    });
  }

  getGoogleUrl(servico) {
    window.open('https://www.google.com/maps/search/?api=1&query=' + servico.latitude + ',' + servico.longitude)
  }

  openCnh() {
    this.resgateService.getLocatarioInfo(this.servicoSelecionado.locatarioId).subscribe((resp: any) => {
      this.dialog.open(GaleryDialog, {
        width: '80%',
        height: '80%',
        data: {
          id: this.servicoSelecionado.id,
          cnh: resp.dataResult.urlCNH,
          selfie: resp.dataResult.urlSelfie
        }
      })
    })
  }


  abriWhatsapp(servicoSelecionado) {
    var tel = servicoSelecionado.locatarioTelefone.ddd +
      servicoSelecionado.locatarioTelefone.numero;
    tel = tel.replace('(', '');
    tel = tel.replace(')', '');
    tel = tel.replace(' ', '');
    window.open('https://api.whatsapp.com/send?phone=55$' + tel)
  }

  abriWhatsAppMottu() {
    window.open('https://api.whatsapp.com/send?phone=55$11963104368')
  }

  removeEmpty() {
    this.showEmpty = false;
  }

  iniciaAtendimento() {
    this.showLoader = true;
    this.resgateService.iniciaAtendimento(this.servicoSelecionado.id).subscribe(() => {
      this.showLoader = false;
      this.atualizaServico();
      this.showDialogMessage("Sucesso", "Servico iniciado", -1);
    }, () => {
      this.showLoader = false;
    })
  }

  iniciaDeslocamento() {
    this.showLoader = true;
    this.resgateService.iniciaDeslocamento(this.servicoSelecionado.id).subscribe(() => {
      this.showLoader = false;
      this.atualizaServico();
      this.showDialogMessage("Sucesso", "Deslocamento Iniciado", -1);
    }, () => {
      this.showLoader = false;
    })
  }


  aceitarServico() {
    this.showLoader = true;
    this.resgateService.aceitarServico(this.servicoSelecionado.id).subscribe(() => {
      this.showLoader = false;
      this.atualizaServico();
      this.showDialogMessage("Sucesso", "Servico Aceito", -1);
    }, () => {
      this.showLoader = false;
    })
  }



  cancelaDeslocamento() {
    this.showLoader = true;
    this.resgateService.cancelaDeslocamento(this.servicoSelecionado.id).subscribe(() => {
      this.showLoader = false;
      this.atualizaServico();
      this.showDialogMessage("Sucesso", "Deslocamento Cancelado", -1);
    }, () => {
      this.showLoader = false;
    })
  }


  setOnlineOffLine() {
    let status = this.isOnline ? "Offline" : "Online";
    let ref = this.showDialogMessage("Atenção", "Deseja confirmar que ficará " + status + "?", 0);

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.isOnline = !this.isOnline;
        this.supportService.setUserOnline(this.auth.userLogged.dataResult.data.id, this.isOnline).subscribe(() => {

        }, () => {
          this.isOnline = !this.isOnline;
        });
      }
    })
  }

  getOnlineStatus() {
      this.supportService.getUsuarioSuporte(this.auth.userLogged.dataResult.data.id).subscribe((resp: any) => {
      this.userStatus = resp.dataResult;
      if (this.userStatus) {
        this.isOnline = this.userStatus.online;
      }
    })
  }


  finalizaServico() {
    let ref2 = this.showDialogMessage("Atenção", "Houve troca de moto?", 0);
    ref2.afterClosed().subscribe((result2) => {
      if (result2 == true || result2 == false) {
        let ref = this.showDialogMessage("Atenção", "Deseja confirmar a finalização desse serviço?", 0);
        ref.afterClosed().subscribe((result) => {
          if (result) {
            this.resgateService.encerrarServico(this.servicoSelecionado.id).subscribe(() => {
              this.getVeiculosResgate();
              this.showDialogMessage("Sucesso", "Servico finalizado", -1);
            })
            this.resgateService.trocaMoto(this.servicoSelecionado.id, result2).subscribe(() => {
            })
          }
        })
      }
    })
  }

  showDialogMessage(title, body, data) {
    return this.dialog.open(MonitorDialog, {
      width: '500px',
      data: {
        data: data,
        message: {
          title: title,
          body: body
        }
      }
    });
  }
}
