import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'operadora'
})
export class OperadoraPipe implements PipeTransform {

  transform(value: unknown): unknown {
    switch (value) {
      case 1:
        return 'Vivo';
      case 2:
        return 'Claro';
      case 3:
        return 'Tim';
      case 4:
        return 'Oi';
      case 5:
        return 'Nextel';
      default:
        break;
    }
    return null;
  }

}
