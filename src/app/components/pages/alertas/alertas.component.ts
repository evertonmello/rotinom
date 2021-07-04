
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { MonitorDialog } from 'src/app/shared/dialogs/monitor-dialog';
import { ResolverDialog } from 'src/app/shared/dialogs/resolver-dialog';
import { MonitorService } from 'src/app/shared/services/monitor.service';
import * as moment from 'moment';
moment.locale('pt-br');
import { eventos } from './../../../shared/enum/eventos';
import { eventosRef } from './../../../shared/enum/eventosRef';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss']
})
export class AlertasComponent implements OnInit {

  public showLoader = true;
  public alarme = false;
  public interval;
  public veiculoSelected;
  public filtroNome = "";
  public filtroPlaca = "";
  public alertas;
  public filtroStatus = "0";
  public filtro = "";
  public tipos = [];
  public dataSelecionada;
  public eventos = Object.values(eventos);
  public eventosRef = eventosRef;
  public locale = {
    applyLabel: 'Confirmar',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
  }
  constructor(
    private monitorService: MonitorService,
    private route: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getAlertas();
    this.interval = setInterval(() => {
      this.getAlertas();
    }, 60000)
  }

  selectTipo(id, evento) {
    if (evento.checked) {
      this.tipos.push(id);
    } else {
      this.tipos = this.tipos.filter(function (item) {
        return item !== id
      })
    }
  }

  getAlertas() {
    this.showLoader = true;

    if (this.filtroNome || this.filtroPlaca || this.dataSelecionada || this.tipos.length > 0) {
      this.filtro = "?";

      if (this.filtroNome) {
        this.filtro = this.filtro + "nome=" + this.filtroNome.toUpperCase();
      }

      if (this.filtroPlaca) {
        this.filtro = this.filtro.includes("=") ? this.filtro + "&placa=" +
          this.filtroPlaca.toUpperCase() : this.filtro + "placa=" + this.filtroPlaca.toUpperCase();;
      }

      if (this.dataSelecionada.endDate) {
        this.filtro = this.filtro == '?' ? '?' : this.filtro + '&';
        let startDate = this.dataSelecionada.startDate.format('MM-DD-YYYY');
        let endDate = this.dataSelecionada.endDate.format('MM-DD-YYYY');
        this.filtro = this.filtro + 'DataInicio=' + startDate + '&dataFim=' + endDate
      }

      if (this.tipos.length > 0) {
        this.filtro = this.filtro == '?' ? '?' : this.filtro + '&';
        var tiposParam = '';
        this.tipos.forEach((element, index) => {
          tiposParam = index == 0 ? tiposParam + 'tipo=' + element : tiposParam + '&tipo=' + element;
        });
        this.filtro = this.filtro + tiposParam
      }
    }


    this.monitorService.getAlertas(this.filtroStatus + this.filtro).subscribe((response: any) => {
      response = response.dataResult;
      if (response.length > 0) {
        this.agruparPorVeiculo(response);
      } else {
        this.alertas = [];
      }
      this.showLoader = false;
      this.filtro = "";
    }, (error) => {
      this.filtro = "";
      this.showLoader = false;
    })
  }

  disparaAlerta() {
    this.alarme = true;
  }

  agruparPorVeiculo(response) {
    var groupBy = function (xs, key) {
      return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };
    let alertasAgrupados = groupBy(response, 'veiculoId');
    this.alertas = Object.values(alertasAgrupados);
    this.orderByAmount()
    this.checkAlertasAlarme();
  }

  orderByAmount() {
    this.alertas.sort(function (a, b) {
      return a.length - b.length
    })
    this.alertas.reverse();
  }

  expandir(alerta) {
    if (this.veiculoSelected == alerta[0].veiculoId) {
      this.veiculoSelected = null;
    } else {
      this.veiculoSelected = alerta[0].veiculoId;
    }
  }

  checkAlertasAlarme() {
    this.alertas.forEach((item) => {
      if (item.length >= 2 || item[0].veiculoEventoTipoId == 35) {
        this.disparaAlerta();
      }
    })
  }
  rastrear(alerta) {
    this.route.navigate(['monitor/' + alerta.placa])
  }

  limpar() {
    this.filtroStatus = "0";
    this.tipos = [];
    this.filtroNome = "";
    this.dataSelecionada = null;
    this.filtroPlaca = "";
  }

  recolher(alerta) {
    let payload = {
      ClienteId: alerta.usuarioId,
      AnalistaId: 123,
      Situacao: 10,
      TicketTipo: 15,
      Prioridade: 1,
    }
    let ref = this.dialog.open(MonitorDialog, {
      width: '500px',
      disableClose: true,
      data: {
        data: null,
        message: {
          title: 'Recolher Veículo',
          body: 'Deseja realmente recolher o veículo?'
        }
      }
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.showLoader = true;
        this.monitorService.recolherVeiculo(payload).subscribe((response: any) => {
          this.showLoader = false;
          this.showMessage('Sucesso', 'Solicitação realizada com sucesso');
        }, (error) => {
          this.showLoader = false;
        })
      }
    });
  }

  bloquear(alerta) {
    let ref = this.dialog.open(MonitorDialog, {
      width: '500px',
      disableClose: true,
      data: {
        data: null,
        message: {
          title: 'Bloquear Veículo',
          body: 'Deseja realmente bloquear o veículo?'
        }
      }
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.showLoader = true;
        this.monitorService.bloquearAlerta(alerta.veiculoId).subscribe((response: any) => {
          this.showLoader = false;
          this.showMessage('Sucesso', 'Bloqueio Realizado com sucesso');
        }, (error) => {
          this.showLoader = false;
        })
      }
    });
  }

  resolver(alerta) {
    let ref = this.dialog.open(ResolverDialog, {
      width: '500px',
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.monitorService.resolverAlerta(alerta.veiculoAlertaId, result).subscribe((response: any) => {
          this.showMessage('Sucesso!', 'Alerta Resolvido com Sucesso');
          this.getAlertas();
        })
      }
    });
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

  abriWhatsapp(alerta) {
    var tel = alerta['usuarioTelefone'];
    tel = tel.replace('(', '');
    tel = tel.replace(')', '');
    tel = tel.replace(' ', '');
    window.open('https://api.whatsapp.com/send?phone=55$' + tel)
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}
