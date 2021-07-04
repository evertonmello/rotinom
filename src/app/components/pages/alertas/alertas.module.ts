import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertasRoutingModule } from './alertas-routing.module';
import { AlertasComponent } from './alertas.component';
import { MaterialModule } from 'src/app/material.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
registerLocaleData(ptBr);
import { LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AlertasComponent],
  imports: [
    CommonModule,
    AlertasRoutingModule,
    NgxDaterangepickerMd.forRoot(),
    MaterialModule,
    FormsModule
  ]
})
export class AlertasModule { }
