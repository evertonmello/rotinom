import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '../../auth/admin.guard';
import { AuthGuard } from '../../auth/auth.guard';
import { RoleGuard } from '../../auth/role.guard';

import { HomeTemplateComponent } from './home-template.component';

const routes: Routes = [
  {
    path: '',
    component: HomeTemplateComponent,
    canActivate: [AuthGuard],
    children: [{
      path: '',
      pathMatch: 'full',
      redirectTo: 'servicos'
    },
    { path: 'monitor',canActivate: [AdminGuard], loadChildren: () => import('./../monitor-module/monitor-module.module').then(m => m.MonitorModuleModule) },
    { path: 'unidades',canActivate: [AdminGuard], loadChildren: () => import('./../unidades-module/unidades-module.module').then(m => m.UnidadesModuleModule) },
    { path: 'delivery',canActivate: [RoleGuard], loadChildren: () => import('./../delivery/delivery.module').then(m => m.DeliveryModule) },
    { path: 'resgate',canActivate: [AdminGuard], loadChildren: () => import('./../resgate-module/resgate-module.module').then(m => m.ResgateModuleModule) },
    { path: 'alertas',canActivate: [AdminGuard], loadChildren: () => import('./../alertas/alertas.module').then(m => m.AlertasModule) },
    { path: 'servicos', loadChildren: () => import('./../servicos/servicos.module').then(m => m.ServicosModule) },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeTemplateRoutingModule { }
