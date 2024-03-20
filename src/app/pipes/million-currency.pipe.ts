import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millionCurrency',
  standalone: true
})
export class MillionCurrencyPipe implements PipeTransform {
  transform(value: string): string {
    return `$${value} million`;
  }
}
