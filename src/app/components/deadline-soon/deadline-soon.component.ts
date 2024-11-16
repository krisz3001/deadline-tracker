import { Component, Input } from '@angular/core';
import { Deadline } from '../../interfaces/deadline.interface';
import { TimestampToDatePipe } from '../../pipes/timestamp-to-date.pipe';

@Component({
  selector: 'app-deadline-soon',
  standalone: true,
  imports: [TimestampToDatePipe],
  templateUrl: './deadline-soon.component.html',
  styleUrl: './deadline-soon.component.css',
})
export class DeadlineSoonComponent {
  @Input({ required: true }) deadline!: Deadline;
}
