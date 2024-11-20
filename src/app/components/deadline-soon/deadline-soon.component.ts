import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Deadline } from '../../interfaces/deadline.interface';
import { TimestampToDatePipe } from '../../pipes/timestamp-to-date.pipe';
import { DEADLINE_DETAILS_DIALOG_WIDTH, ExamType } from '../../config';
import { MatDialog } from '@angular/material/dialog';
import { DeadlineDetailsComponent } from '../deadline-details/deadline-details.component';
import { StarsComponent } from '../stars/stars.component';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-deadline-soon',
  standalone: true,
  imports: [TimestampToDatePipe, StarsComponent, MatIconModule],
  templateUrl: './deadline-soon.component.html',
  styleUrl: './deadline-soon.component.css',
})
export class DeadlineSoonComponent implements OnInit, OnDestroy {
  @Input({ required: true }) deadline!: Deadline;

  examTypes = ExamType;
  sub = new Subscription();
  user: User | null = null;
  completed: boolean = false;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.sub = this.authService.userData.subscribe((user) => {
      this.user = user;
      if (user) {
        this.completed = user.completed.includes(this.deadline.id);
      }
    });
  }

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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
