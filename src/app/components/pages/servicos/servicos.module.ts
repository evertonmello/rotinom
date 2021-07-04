import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicosRoutingModule } from './servicos-routing.module';
import { ServicosComponent } from './servicos.component';
import { AgmCoreModule } from '@agm/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule }   from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import { SupportComponent } from './support/support.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDialog} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  declarations: [ServicosComponent, SupportComponent],
  imports: [
    CommonModule,
    MatRadioModule,
    FormsModule,
    MatSlideToggleModule,
    PipesModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ServicosRoutingModule,
    MatTooltipModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyANwLSxjrksADZTcozpGJM0b0VmJpAhuYs'
    }),
  ]
})
export class ServicosModule { }
