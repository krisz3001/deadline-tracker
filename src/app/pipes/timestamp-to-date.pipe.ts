import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'TimestampToDate',
  standalone: true,
})
export class TimestampToDatePipe implements PipeTransform {
  transform(value: Timestamp): string {
    if (!value) return 'No date';
    return value.toDate().toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
