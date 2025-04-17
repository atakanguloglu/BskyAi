import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'newlineToBr',
  standalone: true
})
export class NewlineToBrPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string): SafeHtml {
    if (!value) return '';

    // Yeni satırları <br> etiketlerine dönüştür
    const result = value.replace(/\n/g, '<br>');

    // Güvenli HTML olarak döndür
    return this.sanitizer.bypassSecurityTrustHtml(result);
  }
}
