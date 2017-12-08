import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'myPipe'})
export class FilterCities implements PipeTransform {
  transform(val) {
    if (val === undefined) return;
    const vall = val.split(',')[0];
    console.log(vall);
    return vall;
  }
}
