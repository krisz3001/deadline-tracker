import { Component, Input } from '@angular/core';
import { Deadline } from '../../interfaces/deadline.interface';
import { TimestampToDatePipe } from '../../pipes/timestamp-to-date.pipe';

@Component({
  selector: 'app-deadline-later',
  standalone: true,
  imports: [TimestampToDatePipe],
  templateUrl: './deadline-later.component.html',
  styleUrl: './deadline-later.component.css',
})
export class DeadlineLaterComponent {
  @Input({ required: true }) deadline!: Deadline;
}
