import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutputPipe } from './output.pipe';
import { SituacaoPipe } from './situacao.pipe';
import { AlertaPipe } from './alerta.pipe';
import { SortPipe } from './sort.pipe';

@NgModule({
  declarations: [OutputPipe,SortPipe, SituacaoPipe,AlertaPipe],
  imports: [
    CommonModule
  ],
  exports: [OutputPipe,SortPipe,SituacaoPipe,AlertaPipe]
})
export class PipesModule { }
