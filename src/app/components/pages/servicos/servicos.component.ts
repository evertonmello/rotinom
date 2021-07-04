import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MonitorDialog } from 'src/app/shared/dialogs/monitor-dialog';
import { WebServiceDetaillDialog } from 'src/app/shared/dialogs/web-service-detail-dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ResgateService } from 'src/app/shared/services/regate.service';

declare var google: any;
let autocomplete;

@Component({
  selector: 'app-servicos',
  templateUrl: './servicos.component.html',
  styleUrls: ['./servicos.component.scss']
})
export class ServicosComponent implements OnInit {

  public novosFilter = true;
  public encaminhadosFilter;
  public showDetalhe = false;
  public atendidosFilter;
  public lat: number = -23.5997058;
  public lng: number = -46.3043523;
  public veiculosResgate;
  public google;
  public inicialVeiculosResgate;
  public veiculosSuporte;
  public showSideBar = true;
  public showLoader = true;
  public mapStyles = [
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ];
  public zoom = 10;

  constructor(
    private auth: AuthService,
    private resgateService: ResgateService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getVeiculosResgate();
    this.getVeiculosSuporte();

    if (!this.auth.isSupportUser) {
      this.initAutocomplete();
    }
  }


  setFilter(filter) {
    if (this.inicialVeiculosResgate) {
      this.veiculosResgate = this.inicialVeiculosResgate.filter((item) => {
        return filter == "aberto" && item.situacao == 0 ||
          filter == "aceitos" && item.situacao == 1 ||
          filter == "encaminhados" && item.situacao == 10 ||
          filter == "emrota" && item.situacao == 11 ||
          filter == "andamento" && item.situacao == 2 ||
          filter == "finalizado" && item.situacao == 3 ||
          filter == "cancelados" && item.situacao == 99;
      });

      if (this.novosFilter && this.encaminhadosFilter && this.encaminhadosFilter) {
        this.veiculosResgate = this.inicialVeiculosResgate;
      }
    }

  }



  getVeiculosResgate() {
    this.resgateService.getVeiculosParaResgate().subscribe((veiculosResgate: any) => {
      this.veiculosResgate = veiculosResgate.dataResult;
      this.inicialVeiculosResgate = this.veiculosResgate;
      this.setFilter('aberto')
    });
  }

  getVeiculosSuporte() {
    this.resgateService.getVeiculosSuporte().subscribe((veiculosResgate: any) => {
      this.veiculosSuporte = veiculosResgate.dataResult;
      this.sortVeiculosSupport();
      this.showLoader = false;
      this.setFilter("novos");
    });
  }

  sortVeiculosSupport() {
    this.veiculosSuporte.sort(function (a, b) {
      return a.servicos.length - b.servicos.length;
    });
    this.veiculosSuporte.reverse();
  }

  getNames(usuariosOnline) {
    let names = "";
    usuariosOnline.forEach(element => {
      names += " " + element.nome + ","
    });
    return names.slice(0, -1);
  }



  detalheServico(veiculo) {
    let ref = this.dialog.open(WebServiceDetaillDialog, {
      width: '500px',
      data: { veiculo: veiculo, veiculosSuporte: this.veiculosSuporte }
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.getVeiculosResgate();
        this.getVeiculosSuporte();
      }
    })
  }


  _filter(term) {
    term = "filtro=" + term;
    this.resgateService.getVeiculosParaResgateFiltered(term).subscribe((veiculosResgate: any) => {
      this.veiculosResgate = veiculosResgate.dataResult;
    });
  }

  rejeitar(id) {
    let ref = this.dialog.open(MonitorDialog, {
      width: '500px',
      disableClose: true,
      data: {
        data: null,
        message: {
          title: 'Rejeitar Serviço',
          body: 'Deseja realmente rejeitar esse serviço?'
        }
      }
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.resgateService.rejeitar(id, "").subscribe((resp: any) => {
          this.getVeiculosSuporte();
          this.getVeiculosResgate();
          this.showMessage('Sucesso', 'Atendimento Rejeitado');
        }, (error) => {
          this.showMessage('Erro', error.mensagem)
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

  initAutocomplete() {
    this.google = google;
    const nativeHomeInputBox = document.getElementById('autocomplete');
    autocomplete = new this.google.maps.places.Autocomplete(nativeHomeInputBox, {
      types: ['geocode'],
    });
    var currentAddress;
    autocomplete.setFields(['address_component']);

    google.maps.event.addListener(autocomplete, 'place_changed', () => {

      const places = autocomplete.getPlace();
      const cep = places.address_components.find((x) => {
        return x.types[0] == 'postal_code';
      });
      const numero = places.address_components.find((x) => {
        return x.types[0] == 'street_number';
      });
      const rua = places.address_components.find((x) => {
        return x.types[0] == 'route';
      });
      const bairro = places.address_components.find((x) => {
        return x.types[0] == 'sublocality_level_1';
      });
      const cidade = places.address_components.find((x) => {
        return x.types[0] == 'administrative_area_level_2';
      });
      const estado = places.address_components.find((x) => {
        return x.types[0] == 'administrative_area_level_1';
      });

      const geocoder = new google.maps.Geocoder();
      const address =
        rua.long_name +
        ', ' +
        numero.long_name +
        ' - ' +
        bairro.long_name +
        ' - ' +
        cidade.long_name +
        ' - ' +
        estado.short_name +
        ' - ' +
        'Brasil' +
        ' - ' +
        cep.short_name;


      geocoder.geocode({ address }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let lat = results[0].geometry.location
            .lat()
            .toFixed(7)
            .toString();
          let lng = results[0].geometry.location
            .lng()
            .toFixed(7)
            .toString();
          this.lat = Number(lat);
          this.lng = Number(lng);
          this.zoom = 18;
        }
      });
    });
  }

  priorizar(servico, veiculoSuporteId) {
    this.resgateService.escalar(servico.id, veiculoSuporteId, servico.ordemSuporte - 1).subscribe((resp) => {
      this.getVeiculosSuporte();
      this.getVeiculosResgate();

    })
  }

  despriorizar(servico, veiculoSuporteId) {
    this.resgateService.escalar(servico.id, veiculoSuporteId, servico.ordemSuporte + 1).subscribe((resp) => {
      this.getVeiculosSuporte();
      this.getVeiculosResgate();

    })
  }


}
