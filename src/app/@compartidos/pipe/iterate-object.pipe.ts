import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'iterateObject'
})
export class IterateObjectPipe implements PipeTransform {
  constructor() {}

  transform(obj: object): SafeHtml {
    if (obj) {
      return Object.keys(obj).map(key => ({ key, value: obj[key] }));
    }
  }
}
