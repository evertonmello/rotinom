import { ApplicationRef, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { DeliveryService } from './../../../shared/services/delivery.service'
import * as moment from 'moment';
import { MonitorService } from 'src/app/shared/services/monitor.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateRange, MatDateRangeSelectionStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { DeliveryModule } from './delivery.module';
import { DateAdapter } from '@angular/material/core';

declare var google: any;
let autocomplete;
moment.locale('pt-br');

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
  providers: [
    { provide: 'rangeMax', useValue: 5 },
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DeliveryComponent
    }
  ]
})
export class DeliveryComponent implements OnInit, MatDateRangeSelectionStrategy<any> {

  public showSideBar = true;
  public showDetalhe = false;
  private heatmap: google.maps.visualization.HeatmapLayer = null;
  private map: google.maps.Map = null;
  public showLoader = true;
  public clusterPath = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';
  public showStoress = false;
  public filterSelected = 'all';
  public zoom = 10;
  public historico;
  public historicoCoordinates = [];
  public google = google || null;
  public showAllEntregadores = true;
  public itemSelecionado;
  public veiculoSelecionadoPesq = '';
  public veiculosPlotMap = [];
  public filteredVehicleBasicInfo;
  public filteredComboVehicleBasicInfo;
  public showAllStores = true;
  public supportVehicles = [];
  public scollIndex = 1;
  public lat: number = -23.5997058;
  public lng: number = -46.3043523;
  public entregadores;
  public stores;
  public resumeListItens = [];
  public defaultMapItens = [];
  public defaultResumeListItens = []
  public itensMap = [];
  public page = 1;
  public range = new FormGroup({
    start: new FormControl(Validators.required),
    end: new FormControl(Validators.required)
  });
  public clusterStyles = [
    {
      url: './../../../../assets/img/m2.png',
      height: 56,
      width: 56
    }
  ];

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
  ]
  constructor(
    private deliveryService: DeliveryService,
     private monitorService: MonitorService,
    @Inject('rangeMax') private delta: number,
    private _dateAdapter: DateAdapter<any>,
    ) { }

  ngOnInit(): void {
    this.getEntregadoresEStoress();
    this.initAutocomplete();
  }

  setSideBarView() {
    this.showSideBar = !this.showSideBar;
  }


  trackByFn(index, item) {
    if (!item) { return null }
    return index;
  }

  fecharDetalhe() {
    if (this.heatmap) {
      this.heatmap.setData([]);
      this.heatmap.setMap(null);
    }
    this.zoom = 10;
    this.showDetalhe = false;
    this.historicoCoordinates = [];
  }
  
  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;
  }

  selectionFinished(date: any, currentRange: DateRange<any>) {
    let { start, end } = currentRange;
    if (start == null || (start && end)) {
      start = date;
      end = null;
    } else if (end == null) {
      const maxDate = this._dateAdapter.addCalendarDays(start, this.delta);
      end = date ? date > maxDate ? maxDate : date : null;
    }
    return new DateRange<any>(start, end);
  }

  createPreview(activeDate: any | null, currentRange: DateRange<any>): DateRange<any> {
    if (currentRange.start && !currentRange.end) {
      const maxDate = this._dateAdapter.addCalendarDays(currentRange.start, this.delta);
      const rangeEnd = activeDate ? activeDate > maxDate ? maxDate : activeDate : null;
      return new DateRange(currentRange.start, rangeEnd);
    }
    return new DateRange<any>(null, null);
  }

  getVeiculoHistorico(veiculoSelecionado) {
    this.showLoader = true;
    let veiculoId = veiculoSelecionado.veiculo.veiculoId;
    let startDate = moment(this.range.value.start).format('YYYY-MM-DD');
    let endDate = moment(this.range.value.end).format('YYYY-MM-DD')
    this.monitorService.getVeiculosHistoricoLocalizacao(veiculoId, startDate, endDate).subscribe((result: any) => {
      this.historico = result.dataResult;
      this.plotHistorico();
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;
    });
  }

  plotHistorico() {
    this.historicoCoordinates = [];
    var cores = ['#71c7ec', '#1ebbd7', '#189ad3', '#75a6ad', '#7a968a', '#6d877c', '#61786e']
    var diaCor = -1;
    var sColor = null;
    var dia = null;
    const heatmapPoints = [];

    this.historico.forEach(d => {
      var localizadorData = (new Date(d.localizadorData)).getDate();
      if (dia != localizadorData) diaCor++;
      dia = localizadorData;
      sColor = cores[diaCor];
      this.historicoCoordinates.push({ lat: d.latitude, lng: d.longitude, color: sColor });
      heatmapPoints.push(new google.maps.LatLng(d.latitude, d.longitude));
    });
    if (this.heatmap) {
      this.heatmap.setData([]);
      this.heatmap.setMap(null);
    }
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      data: heatmapPoints,
      options: {
        radius: 80,
        dissipating: true
      },
    });

  }

  getGoogleUrl() {
    return 'https://www.google.com/maps/search/?api=1&query=' + this.itemSelecionado.veiculo?.latitude || this.itemSelecionado.endereco.latitude +
      ',' + this.itemSelecionado.veiculo?.longitude || this.itemSelecionado.endereco.longitude;
  }

  refresh() {
    this.getEntregadoresEStoress();
  }
  searchVeiculo(item) {
    if (!item.remetenteId) {
      this.getEntregadorDetalhe(item)
    } else {
      this.getStoreDetalhe(item);
    }
  };

  getEntregadorDetalhe(entregador) {
    this.showDetalhe = true;
    this.deliveryService.getEntregadorDetalhe(entregador.id).subscribe((resp: any) => {
      this.itemSelecionado = resp.dataResult;
      this.itemSelecionado['status'] = entregador.status;
      this.lat = this.itemSelecionado.veiculo.latitude;
      this.lng = this.itemSelecionado.veiculo.longitude;
      this.zoom = 20;
      this.showLoader = false;
    })
  }


  getStoreDetalhe(store) {
    this.showDetalhe = true;
    this.deliveryService.getStoreDetalhe(store.remetenteId).subscribe((resp: any) => {
      this.itemSelecionado = resp.dataResult;
      this.lat = this.itemSelecionado.endereco.latitude;
      this.lng = this.itemSelecionado.endereco.longitude;
      this.zoom = 20;
      this.showLoader = false;
    })
  }

  abriWhatsapp() {
    let ddi = this.itemSelecionado.telefones[0].ddd || '';
    var tel = this.itemSelecionado.telefones[0].ddd + ddi +
      this.itemSelecionado.telefones[0].numero;

    tel = tel.replace('(', '');
    tel = tel.replace(')', '');
    tel = tel.replace(' ', '');
    window.open('https://api.whatsapp.com/send?phone=55$' + tel)
  }
  manageScroll() {
    this.scollIndex++;
  }

  dropdownFilter() {

    switch (this.filterSelected) {
      case 'on':
        this.resumeListItens = this.entregadores.filter((item) => {
          return item.status.online
        });
        break;
      case 'off':
        this.resumeListItens = this.entregadores.filter((item) => {
          return !item.status.online
        })
        break;
      case 'hasDelivered':
        this.resumeListItens = this.entregadores.filter((item) => {
          return item.status.entregas.length != 0
        });
        break;
      case 'stores':
        this.resumeListItens = this.stores;
        break;
      case 'neverDelivered':
        this.resumeListItens = this.entregadores.filter((item) => {
          return item.status.entregas.length == 0;
        });
        break;
      default:
        this.resumeListItens = this.defaultResumeListItens;
        break;
    }
  }

  recenter() {
    if (this.showDetalhe) {
      this.zoom = 18;
      this.lat = this.veiculosPlotMap[0].latitude + (0.00001 * Math.random());
      this.lng = this.veiculosPlotMap[0].longitude + (0.00001 * Math.random());;
    }
  }

  getEntregador() {
    this.showLoader = true;
    this.deliveryService.getEntregadores().subscribe((resp: any) => {
      this.entregadores = resp.dataResult.list;
      this.itensMap = this.entregadores;
      this.showLoader = false;
    });
  }

  getStores() {
    this.deliveryService.getStores().subscribe((resp: any) => {
      this.stores = resp.dataResult.list;
    })
  }

  getEntregadoresEStoress() {
    this.showLoader = true;
    this.deliveryService.getBoraBoraItens().subscribe((resp: any) => {
      this.entregadores = resp[0].dataResult.list;
      this.stores = resp[1].dataResult.list;

      this.resumeListItens = this.entregadores.concat(this.stores);
      this.defaultResumeListItens = this.resumeListItens;
      this.defaultMapItens = this.resumeListItens;

      this.filterSelected = 'all';

      this.showLoader = false;
    })
  }

  getItemMapColor(item) {
    if (item.status && item.status.online) {
      return '#FFCC0E';
    }
    if (item.remetenteId) {
      return '#3B7CFF';
    }

    if (item.status && !item.status.online) {
      return '#777C78';
    }
  }


  searchItem() {
    let regex = new RegExp("[0-9]");

    if (regex.test(this.veiculoSelecionadoPesq)) {
      this.deliveryService.getBoraBoraItensById(this.veiculoSelecionadoPesq).subscribe((resp: any) => {
        this.entregadores = resp[0].dataResult.list;
        this.stores = resp[1].dataResult.list;

        this.resumeListItens = this.entregadores.concat(this.stores);
        this.defaultResumeListItens = this.resumeListItens;
      });
    } else {
      this.deliveryService.getBoraBoraItensByName(this.veiculoSelecionadoPesq).subscribe((resp: any) => {
        this.entregadores = resp[0].dataResult.list;
        this.stores = resp[1].dataResult.list;

        this.resumeListItens = this.entregadores.concat(this.stores);
        this.defaultResumeListItens = this.resumeListItens;
      });
    }

  }

  initAutocomplete() {
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

}
