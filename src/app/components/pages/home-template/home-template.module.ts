import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeTemplateRoutingModule } from './home-template-routing.module';
import { HomeTemplateComponent } from './home-template.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialModule } from 'src/app/material.module';


@NgModule({
  declarations: [HomeTemplateComponent],
  imports: [
    CommonModule,
    HomeTemplateRoutingModule,
    MatIconModule,
    MatToolbarModule,
    MaterialModule
  ]
})
export class HomeTemplateModule { }
