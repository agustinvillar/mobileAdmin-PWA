import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'datePipe'
})
export class DatePipe implements PipeTransform {
  
  transform(date: string, format: string): string {
    if (date) {
      return moment(date).format(format);
    }
  }

}
