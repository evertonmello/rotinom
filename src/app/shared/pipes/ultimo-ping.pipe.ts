import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ultimoPing'
})
export class UltimoPingPipe implements PipeTransform {

  transform(value): unknown {
    return null;
  }

}
