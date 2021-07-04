import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alerta'
})
export class AlertaPipe implements PipeTransform {

  transform(value: unknown): unknown {
    if(value == 0){
      return 'Nenhum alerta';
    }
    if(value == 1){
      return '1 alerta'
    }
    if(value > 1){
      return value + ' alertas'
    }
    return null;
  }

}
