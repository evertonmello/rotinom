import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(itens): unknown {
    itens = itens.sort(function (a, b) {
      if (a.ordemSuporte > b.ordemSuporte) {
        return 1;
      }
      if (a.ordemSuporte < b.ordemSuporte) {
        return -1;
      }
      return 0;
    });
    return itens;
  }

}
