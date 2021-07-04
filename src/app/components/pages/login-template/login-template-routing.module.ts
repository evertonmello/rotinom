import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginTemplateComponent } from './login-template.component';

const routes: Routes = [{ path: '', component: LoginTemplateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginTemplateRoutingModule { }
