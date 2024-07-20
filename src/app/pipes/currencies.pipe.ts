import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencies',
  standalone: true,
})
export class CurrenciesPipe implements PipeTransform {

  transform(value: string[], isFiltered: boolean): string[] {
    return isFiltered ? ['UAH'] : value;
  }
}
