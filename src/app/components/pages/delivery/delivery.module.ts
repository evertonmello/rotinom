import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryRoutingModule } from './delivery-routing.module';
import { DeliveryComponent } from './delivery.component';
import { MaterialModule } from 'src/app/material.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';


@NgModule({
  declarations: [DeliveryComponent],
  imports: [
    MaterialModule,
    InfiniteScrollModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    DeliveryRoutingModule,
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyANwLSxjrksADZTcozpGJM0b0VmJpAhuYs'
    }),
    AgmJsMarkerClustererModule
  ]
  
})
export class DeliveryModule { }
