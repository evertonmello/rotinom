import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { MonitorDialog } from './shared/dialogs/monitor-dialog'
import { HistoricoDialog } from './shared/dialogs/historico-dialog'
import { ResolverDialog } from './shared/dialogs/resolver-dialog'

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
registerLocaleData(ptBr);

import { AppComponent } from './app.component';
import { LoginLayoutComponent } from './components/layouts/login-layout.component';
import { AuthGuard } from './components/auth/auth.guard';
import { AuthService } from './shared/services/auth.service';
import { JwtInterceptor } from './components/auth/jwt.interceptor';
import { HttpErrorInterceptor } from './components/auth/error.interceptor';
import { MaterialModule } from './material.module'
import { ChecklistService } from './shared/services/checklist.service';
import { DeleteDialog } from './shared/dialogs/delete-dialog';
import { environment } from '../environments/environment';
import { NewsletterService } from './shared/services/newsletter.service';
import { ServicoDialog } from './shared/dialogs/servico-dialog';
import { AddServiceDialog } from './shared/dialogs/add-service-dialog';
import { WebServiceDetaillDialog } from './shared/dialogs/web-service-detail-dialog';
import { ImageDialog } from './shared/dialogs/image-dialog';
import { GaleryDialog } from './shared/dialogs/galery-dialog';
import { RoleGuard } from './components/auth/role.guard';
import { AdminGuard } from './components/auth/admin.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginLayoutComponent,
    MonitorDialog,
    HistoricoDialog,
    ImageDialog,
    ResolverDialog,
    DeleteDialog,
    ServicoDialog,
    AddServiceDialog,
    WebServiceDetaillDialog,
    GaleryDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InfiniteScrollModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyANwLSxjrksADZTcozpGJM0b0VmJpAhuYs'
    }),
    AgmJsMarkerClustererModule
  ],
  entryComponents:[
    MonitorDialog,
    ResolverDialog,
    ImageDialog,
    ServicoDialog,
    DeleteDialog,
    HistoricoDialog,
    AddServiceDialog,
    WebServiceDetaillDialog,
    GaleryDialog
  ],
  providers: [
    AuthService,
    NewsletterService,
    AuthGuard,
    RoleGuard,
    AdminGuard,
    ChecklistService,
    { provide: LOCALE_ID, useValue: 'pt-PT' },

    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
