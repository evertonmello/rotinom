import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { MonitorModuleRoutingModule } from './monitor-module-routing.module';
import { MonitorModuleComponent } from './monitor-module.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ResgateFormComponent } from './resgate-form/resgate-form.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { BlockModalComponent } from './block-modal/block-modal.component';
import { MonitorDetailComponent } from './monitor-detail/monitor-detail.component';


@NgModule({
  declarations: [MonitorModuleComponent, ResgateFormComponent, BlockModalComponent, MonitorDetailComponent],
  imports: [
    MaterialModule,
    InfiniteScrollModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonToggleModule,
    MonitorModuleRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    PipesModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyANwLSxjrksADZTcozpGJM0b0VmJpAhuYs'
    }),
    AgmJsMarkerClustererModule
  ]
})
export class MonitorModuleModule { }
