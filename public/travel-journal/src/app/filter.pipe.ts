import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    if (value > 1)
      return value + ' Galleries'
    return value + ' Gallery';
  }

}
