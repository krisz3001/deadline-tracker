import { Component, HostListener, Input } from '@angular/core';
import { Deadline } from '../../interfaces/deadline.interface';
import { TimestampToDatePipe } from '../../pipes/timestamp-to-date.pipe';
import { DEADLINE_DETAILS_DIALOG_WIDTH, ExamType } from '../../config';
import { MatDialog } from '@angular/material/dialog';
import { DeadlineDetailsComponent } from '../deadline-details/deadline-details.component';
import { StarsComponent } from '../stars/stars.component';

@Component({
  selector: 'app-deadline-soon',
  standalone: true,
  imports: [TimestampToDatePipe, StarsComponent],
  templateUrl: './deadline-soon.component.html',
  styleUrl: './deadline-soon.component.css',
})
export class DeadlineSoonComponent {
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
