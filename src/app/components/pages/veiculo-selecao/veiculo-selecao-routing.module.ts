import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VeiculoSelecaoComponent } from './veiculo-selecao.component';

const routes: Routes = [{ path: '', component: VeiculoSelecaoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VeiculoSelecaoRoutingModule { }
