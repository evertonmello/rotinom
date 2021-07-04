import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnidadesModuleComponent } from './unidades-module.component';

const routes: Routes = [{ path: '', component: UnidadesModuleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnidadesModuleRoutingModule { }
