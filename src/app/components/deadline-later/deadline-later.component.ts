import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Deadline } from '../../interfaces/deadline.interface';
import { TimestampToDatePipe } from '../../pipes/timestamp-to-date.pipe';
import { DEADLINE_DETAILS_DIALOG_WIDTH, ExamType } from '../../config';
import { StarsComponent } from '../stars/stars.component';
import { DeadlineDetailsComponent } from '../deadline-details/deadline-details.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-deadline-later',
  standalone: true,
  imports: [TimestampToDatePipe, StarsComponent, MatIconModule],
  templateUrl: './deadline-later.component.html',
  styleUrl: './deadline-later.component.css',
})
export class DeadlineLaterComponent implements OnInit, OnDestroy {
  @Input({ required: true }) deadline!: Deadline;

  examTypes = ExamType;
  completed: boolean = false;
  sub: Subscription = new Subscription();
  user: User | null = null;

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
