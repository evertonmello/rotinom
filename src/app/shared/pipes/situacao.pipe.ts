import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'situacao'
})
export class SituacaoPipe implements PipeTransform {

  transform(value: unknown): unknown {
    switch (value) {
      case 0:
        return 'Em Trânsito';
      case 10:
        return 'Recebido de Fábrica';
      case 20:
        return 'Pronto para Aluguel';
      case 30:
        return 'Manutenção';
      case 60:
        return 'Alugada';
      default:
        break;
    }
    return null;
  }

}
