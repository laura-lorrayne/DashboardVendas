import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyBr' })
export class CurrencyBrPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
