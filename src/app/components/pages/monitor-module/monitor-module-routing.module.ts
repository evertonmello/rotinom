import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonitorModuleComponent } from './monitor-module.component';

const routes: Routes = [
  { path: ':placa', component: MonitorModuleComponent },
  { path: '', component: MonitorModuleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitorModuleRoutingModule { }
