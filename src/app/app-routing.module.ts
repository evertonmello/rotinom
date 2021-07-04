import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './components/auth/auth.guard';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./components/pages/home-template/home-template.module').then(m => m.HomeTemplateModule) },
  { path: 'login', loadChildren: () => import('./components/pages/login-template/login-template.module').then(m => m.LoginTemplateModule) },
  { path: 'veiculo-selecao',     canActivate: [AuthGuard], loadChildren: () => import('./components/pages/veiculo-selecao/veiculo-selecao.module').then(m => m.VeiculoSelecaoModule) },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
