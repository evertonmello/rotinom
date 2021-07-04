import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnidadesModuleRoutingModule } from './unidades-module-routing.module';
import { UnidadesModuleComponent } from './unidades-module.component';
import { VeiculoFormComponent } from './veiculo-form/veiculo-form.component';
import { IotFormComponent } from './iot-form/iot-form.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { MaterialModule } from 'src/app/material.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BrowserModule } from '@angular/platform-browser';
import { OcorrenciasComponent } from './ocorrencias/ocorrencias.component';
import {MatDatepickerModule} from '@angular/material/datepicker';


@NgModule({
  declarations: [
    UnidadesModuleComponent,
    VeiculoFormComponent,
    IotFormComponent,
    ChecklistComponent,
    OcorrenciasComponent,
  ],
  imports: [
    MaterialModule,
    FormsModule,
    InfiniteScrollModule,
    CommonModule,
    ReactiveFormsModule,
    UnidadesModuleRoutingModule,
    PipesModule,
    MatDatepickerModule
  ]
})
export class UnidadesModuleModule { }
