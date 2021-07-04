import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeiculoSelecaoRoutingModule } from './veiculo-selecao-routing.module';
import { VeiculoSelecaoComponent } from './veiculo-selecao.component';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [VeiculoSelecaoComponent],
  imports: [
    MatButtonModule,
    FormsModule,
    CommonModule,
    VeiculoSelecaoRoutingModule
  ]
})
export class VeiculoSelecaoModule { }
