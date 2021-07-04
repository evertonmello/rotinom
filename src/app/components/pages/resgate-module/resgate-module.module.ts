import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResgateModuleRoutingModule } from './resgate-module-routing.module';
import { ResgateModuleComponent } from './resgate-module.component';
import { MaterialModule } from 'src/app/material.module';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';   // agm-direction
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

@NgModule({
  declarations: [ResgateModuleComponent],
  imports: [
    CommonModule,
    AgmDirectionModule,
    ResgateModuleRoutingModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyANwLSxjrksADZTcozpGJM0b0VmJpAhuYs'
    }),
    AgmJsMarkerClustererModule
  ]
})
export class ResgateModuleModule { }
