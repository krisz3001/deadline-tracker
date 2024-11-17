import { Component, HostListener, Input } from '@angular/core';
import { Deadline } from '../../interfaces/deadline.interface';
import { TimestampToDatePipe } from '../../pipes/timestamp-to-date.pipe';
import { DEADLINE_DETAILS_DIALOG_WIDTH, ExamType } from '../../config';
import { StarsComponent } from '../stars/stars.component';
import { DeadlineDetailsComponent } from '../deadline-details/deadline-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-deadline-later',
  standalone: true,
  imports: [TimestampToDatePipe, StarsComponent],
  templateUrl: './deadline-later.component.html',
  styleUrl: './deadline-later.component.css',
})
export class DeadlineLaterComponent {
  @Input({ required: true }) deadline!: Deadline;

  examTypes = ExamType;

  constructor(private dialog: MatDialog) {}

  @HostListener('click')
  openDetails(): void {
    if (this.dialog.openDialogs.length > 0) return;

    this.dialog.open(DeadlineDetailsComponent, {
      width: `${DEADLINE_DETAILS_DIALOG_WIDTH}px`,
      data: {
        deadline: this.deadline,
      },
    });
  }
}
