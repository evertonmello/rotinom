import { ApplicationRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MonitorDialog } from 'src/app/shared/dialogs/monitor-dialog';
import { VeiculoSelecionado } from 'src/app/shared/models/VeiculoSelecionado.model';
import { MonitorService } from 'src/app/shared/services/monitor.service';
import * as moment from 'moment';

import { eventos } from './../../../shared/enum/eventos';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateRange, MatDateRangeSelectionStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { HistoricoDialog } from 'src/app/shared/dialogs/historico-dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
declare var google: any;
let autocomplete;
moment.locale('pt-br');

@Component({
  selector: 'app-monitor-module',
  templateUrl: './monitor-module.component.html',
  styleUrls: ['./monitor-module.component.scss'],
  providers: [
    {provide: 'rangeMax', useValue: 5},
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: MonitorModuleComponent
    }
  ]
})
export class MonitorModuleComponent implements OnInit, MatDateRangeSelectionStrategy<any> {

  public lat: number = -23.5997058;
  public lng: number = -46.3043523;
  private heatmap: google.maps.visualization.HeatmapLayer = null;
  private map: google.maps.Map = null;
  public google;
  public clusterPath = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';
  public scollIndex = 1;
  public showLoader = true;
  public showAllvehicles = false;
  public showSideBar = true;
  public veiculos;
  public zoom = 10;
  public totalAlertas;
  public vehiclesBasicInfo = [];
  public distanciaAtual = '';
  public filteredVehicleBasicInfo;
  public filteredComboVehicleBasicInfo;
  public situacao = "Alugada";
  public dataSelecionada;
  public locale = {
    applyLabel: 'Confirmar',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
  }
  public veiculoAlertas;
  public veiculosPlotMap = [];
  public alertaDesc;
  public ultimaAtualizacao;
  public filterSelected = 'all';
  public carregadoAlerta = false;
  public historico;
  public oneHourBlock = false;
  public historicoCoordinates = [];
  public showConfirmDialog = false;
  public resgateForm = false;
  public veiculoSelecionadoPesq = '';
  public interval;
  public supportVehicles = [];
  public reserveVehicles = [];  
  public detailInterval;
  public violacaoCarenagem = true;
  public violacaoBlindagem = true;
  public veiculoSelecionado: VeiculoSelecionado;
  public ultimoAlerta;
  public showSupportVehicles = false;
  public showReserveVehicles = false;
  public currentVehiclesLocations;
  public showDetalhe = false;
  public range = new FormGroup({
    start: new FormControl(Validators.required),
    end: new FormControl(Validators.required)
  });
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
  @ViewChild('tabGroup', { static: true }) tabGroup;

  constructor(
    private monitorService: MonitorService,
    public dialog: MatDialog,
    public app: ApplicationRef,
    public auth: AuthService,
    @Inject('rangeMax') private delta: number,
    private _dateAdapter: DateAdapter<any>,
    private activatedRoute: ActivatedRoute) {
    this.verificaParametros();
  }

  ngOnInit() {
    this.getVehicleBasicInfo();
    if(!this.auth.isSupportUser){
      this.initAutocomplete();
    }
  }

  getVehicleBasicInfo() {
    this.showLoader = true;
    this.monitorService.getVehicleBasicInfo().subscribe((resp: any) => {
      this.vehiclesBasicInfo = resp.dataResult;
      this.filteredVehicleBasicInfo = this.vehiclesBasicInfo;
      this.filteredComboVehicleBasicInfo = this.vehiclesBasicInfo;
      this.showLoader = false;
    })
  }

  verificaParametros() {
    this.activatedRoute.url.subscribe((url) => {
      if (url[0] && url[0].path) {
        this.veiculoSelecionadoPesq = url[0].path;
      }
    })
  }

  getAlertas(placa){
    this.monitorService.getAlertas('30?placa=' + placa).subscribe((resp:any)=>{
      this.veiculoAlertas = resp.dataResult;
    })
  }

  setMarker(veiculo) {
    return {
      path: 'assets/img/green-arrow.png',
      scale: 3,
      fillColor: veiculo.iotSituacaoId == 10 ? "red" : "green",
      fillOpacity: 0.8,
      strokeWeight: 1,
      rotation: veiculo.angulo
    }
  }

  setSideBarView() {
    this.showSideBar = !this.showSideBar;
  }

  getVeiculos() {
    this.showLoader = true;
    this.monitorService.getVeiculos('').subscribe((result: any) => {
      this.veiculos = result.dataResult;
      if (this.veiculoSelecionadoPesq) {
        this.searchVeiculo({ value: -1 })
      }
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;
    })
  }

  showAllInMap() {
    this.veiculosPlotMap = this.veiculos;
  }

  hideAllInMap() {
    this.veiculosPlotMap = [];
  }

  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;
  }

  showSupportDetail(veiculo){
    this.veiculoSelecionado = veiculo;
    this.showDetalhe = true;
  }

  showReserveDetail(veiculo){
    this.veiculoSelecionado = veiculo;
    this.showDetalhe = true;
  }  

  fecharDetalhe() {
    if (this.heatmap) {
      this.heatmap.setData([]);
      this.heatmap.setMap(null);
    }
    this.historico = null;
    this.showDetalhe = false;
    this.historicoCoordinates = [];

    if (this.showAllvehicles) {
      this.veiculosPlotMap = this.currentVehiclesLocations;
    }
    clearInterval(this.detailInterval);
  }

  getGoogleUrl() {
    return 'https://www.google.com/maps/search/?api=1&query=' + this.veiculoSelecionado.latitude + ',' + this.veiculoSelecionado.longitude;
  }

  manageScroll() {
    this.scollIndex++;
  }

  searchVeiculo(event) {
    this.showLoader = true;
    var placa;
    if (!event.placa) {
      let item = this.filteredVehicleBasicInfo.filter((item) => {
        return item.id == event.veiculoId
      });
      placa = item[0].placa;
    } else {
      placa = event.placa;
    }
    this.getAlertas(placa);
    this.monitorService.getVeiculos(placa).subscribe((resp: any) => {
      this.detalheVeiculo(resp.dataResult[0]);
      this.veiculosPlotMap = [];
      this.veiculosPlotMap.push(resp.dataResult[0])
      this.showLoader = false;
    })
  }

  abriWhatsapp() {
    var tel = this.veiculoSelecionado['responsavelTelefone'];
    tel = tel.replace('(', '');
    tel = tel.replace(')', '');
    tel = tel.replace(' ', '');
    window.open('https://api.whatsapp.com/send?phone=55$' + tel)
  }

  detalheVeiculo(veiculo) {
    this.veiculoSelecionado = veiculo;
    this.veiculoSelecionado.veiculoId = veiculo.veiculoId || veiculo.id;
    this.calculaDistancia(this.veiculoSelecionado);
    this.carregaPreviaAlertas(this.veiculoSelecionado.veiculoId);
    var d;
    d = new Date(veiculo.geolocationData);
    var now = Date.now();
    var diff = now - d;
    var minutes = Math.floor((diff / 1000) / 60);
    this.ultimaAtualizacao = minutes + ' min. Atrás ( ' + veiculo.geolocationData + ' )';
    this.lat = this.veiculoSelecionado.latitude - 0.0005;
    this.lng = this.veiculoSelecionado.longitude + 0.0002;
    if (!this.showDetalhe) {
      this.zoom = 15;
    }
    this.showDetalhe = true;
    this.setAutoUpdateVehicle();
  }

  setAutoUpdateVehicle() {
    this.detailInterval = setInterval(() => {
      this.monitorService.getLocalizacaoVeiculo(this.veiculoSelecionado.veiculoId).subscribe((resp: any) => {
        this.veiculosPlotMap[0].latitude = resp.dataResult.latitude;
        this.veiculosPlotMap[0].longitude = resp.dataResult.longitude;
        this.veiculosPlotMap[0].angulo = resp.dataResult.angulo;
      })
    }, 30000)
  }

  atualizaVeiculos() {
    this.showLoader = true;
    this.monitorService.atualizaVeiculos().subscribe((result: any) => {
      this.veiculosPlotMap = result.dataResult;
      this.currentVehiclesLocations = this.veiculosPlotMap;
      this.showLoader = false;
    })
  }

  setVehiclesView() {
    if (this.showAllvehicles) {
      this.atualizaVeiculos();
    } else {
      this.veiculosPlotMap = [];
    }
  }

  setZoom(zoom) {
    // this.zoom = zoom;
  }

  showConfirm(oneHour) {
    this.oneHourBlock = oneHour;
    this.showConfirmDialog = true;
  }


  setDiaogModel(){
    this.showConfirmDialog = false;
    this.getVeiculos();
  }

  calculaDistancia(veiculo) {
    const base = { lat: -23.5594776, lng: -46.6505601 };
    var moto = { lat: veiculo.latitude, lng: veiculo.longitude };

    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();
    const route = {
      origin: base,
      destination: moto,
      travelMode: 'DRIVING'
    }
    directionsService.route(route, (response, status) => {
      directionsRenderer.setDirections(response);
      var directionsData = response.routes[0].legs[0];
      if (!directionsData) {
        return;
      } else {
        this.distanciaAtual = directionsData.distance.text;
      }
    });
  }


  public _filter(value) {
    if (value == '') {
      this.setFilter(false)
    } else {
      const filterValue = value.toLowerCase();
      this.filteredVehicleBasicInfo = this.filteredComboVehicleBasicInfo.filter(option => {
        if (option.placa) {
          return option?.placa?.toLowerCase().includes(filterValue) == true || option?.locatarioNome?.toString().toLowerCase().includes(filterValue) == true
          || option?.locatarioId?.toString().includes(filterValue) == true;
        }
      });
    }
  }

  setFilter(runTextFilter) {
    switch (this.filterSelected) {
      case 'unlocked':
        this.filteredComboVehicleBasicInfo = this.vehiclesBasicInfo.filter((item) => {
          return item.situacaoIot == 0
        });
        break;
      case 'locked':
        this.filteredComboVehicleBasicInfo = this.vehiclesBasicInfo.filter((item) => {
          return item.situacaoIot == 10
        });
        break;
      case 'lockOrder':
        this.filteredComboVehicleBasicInfo = this.vehiclesBasicInfo.filter((item) => {
          return item.situacaoIot == 20
        });
        break;
      case 'unlockOrder':
        this.filteredComboVehicleBasicInfo = this.vehiclesBasicInfo.filter((item) => {
          return item.situacaoIot == 30
        });
        break;
      case 'rented':
        this.filteredComboVehicleBasicInfo = this.vehiclesBasicInfo.filter((item) => {
          return item.situacaoVeiculo == 60
        });
        break;
      case 'maintenance':
        this.filteredComboVehicleBasicInfo = this.vehiclesBasicInfo.filter((item) => {
          return item.situacaoVeiculo == 30
        });
        break;
      case 'onCourse':
        this.filteredComboVehicleBasicInfo = this.vehiclesBasicInfo.filter((item) => {
          return item.situacaoVeiculo == 0
        });
        break;

      case 'received':
        this.filteredComboVehicleBasicInfo = this.vehiclesBasicInfo.filter((item) => {
          return item.situacaoVeiculo == 10
        });
        break;
      case 'ready':
        this.filteredComboVehicleBasicInfo = this.vehiclesBasicInfo.filter((item) => {
          return item.situacaoVeiculo == 20
        });
        break;

      default:
        this.filteredComboVehicleBasicInfo = this.vehiclesBasicInfo;
        break;
    }
    this.filteredVehicleBasicInfo = this.filteredComboVehicleBasicInfo;
    if (runTextFilter) {
      this._filter(this.veiculoSelecionadoPesq);
    }
  }

  carregaPreviaAlertas(veiculoId) {
    this.monitorService.previaAlertas(veiculoId).subscribe((response: any) => {
      this.totalAlertas = response.dataResult.alertaQtd;
      this.alertaDesc = eventos[response.dataResult.eventoTipo];
      var d = new Date(response.dataResult.ultimaOcorrencia);
      var strDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " +
        d.getHours() + ":" + d.getMinutes();
      this.ultimoAlerta = strDate;
    })
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

  setResgateView() {
    this.resgateForm = !this.resgateForm;
  }

  getVeiculoHistorico(veiculoSelecionado) {
    this.showLoader = true;
    let veiculoId = veiculoSelecionado.id;
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

  recenter() {
    if (this.showDetalhe) {
      this.zoom = 18;
      this.lat = this.veiculosPlotMap[0].latitude + (0.00001 * Math.random());
      this.lng = this.veiculosPlotMap[0].longitude + (0.00001 * Math.random());;
    }
  }

  refresh() {
    this.getVehicleBasicInfo();
    if (this.showAllvehicles) {
      this.atualizaVeiculos();
    }
  }

  getVeiculosSuportes() {
    if (this.showSupportVehicles) {
      this.monitorService.getVeiculosSuporteLocalizacoes().subscribe((resp: any) => {
        this.supportVehicles = resp.dataResult;
      })
    }
  }
  getVeiculosReserva() {
    if (this.showReserveVehicles) {
      this.monitorService.getVeiculosReservaLocalizacoes().subscribe((resp: any) => {
        this.reserveVehicles = resp.dataResult;
      })
    }
  }  

  initAutocomplete() {
    const nativeHomeInputBox = document.getElementById('autocompleteMonitor');
    this.google = google;
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
          this.app.tick();
        }
      });
    });
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

  openBlockHistory(){
    this.monitorService.getHistoricoBlock(this.veiculoSelecionado.veiculoId).subscribe((resp:any)=>{
      this.openHistoricoDialog(resp.dataResult)
    });
  }

  openHistoricoDialog(historicoData){
    this.dialog.open(HistoricoDialog, {
      width: '500px',
      data: historicoData
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    clearInterval(this.detailInterval);
  }


}
