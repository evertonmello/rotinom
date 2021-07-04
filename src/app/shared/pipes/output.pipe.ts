import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'output'
})
export class OutputPipe implements PipeTransform {

  transform(value): unknown {
    switch (value) {
      case true:
        return "Acionada";
      case false:
        return "Não Acionada"      
      default:
        return " - ";
    }
  }

}
