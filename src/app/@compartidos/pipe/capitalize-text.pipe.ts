import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'capitalizeText'
})
export class CapitalizeTextPipe implements PipeTransform {
  constructor() {}

  transform(text: string): SafeHtml {
    if (text) {
      const newText = text.toLowerCase();
      return newText.charAt(0).toUpperCase() + newText.slice(1);
    }
  }
}
