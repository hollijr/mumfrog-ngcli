import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayify'
})
export class ArrayifyPipe implements PipeTransform {

  transform(val) {
    return Array.isArray(val)
          ? val : [ val ];
  }

}