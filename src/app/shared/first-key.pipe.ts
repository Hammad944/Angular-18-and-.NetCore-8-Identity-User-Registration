import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstKey',
  standalone: true
})
export class FirstKeyPipe implements PipeTransform {

  transform(value: any): string | null {
    const keys = Object.keys(value);
    console.log(keys, 'keys')
    if (keys && keys.length > 0) {
      return keys[0]
    }
    return null;
  }

}
