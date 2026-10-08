import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();

    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just Now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'M Ago';

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + 'H Ago';

    const days = Math.floor(hours / 24);
    return days + 'D Ago';
  }
}
