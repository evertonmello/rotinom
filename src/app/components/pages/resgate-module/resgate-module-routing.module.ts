import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResgateModuleComponent } from './resgate-module.component';

const routes: Routes = [{ path: '', component: ResgateModuleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResgateModuleRoutingModule { }
