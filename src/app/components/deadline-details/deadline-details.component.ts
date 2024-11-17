import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Deadline } from '../../interfaces/deadline.interface';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DEADLINE_EDITOR_DIALOG_WIDTH, errorSnackbarConfig, ExamType, successSnackbarConfig } from '../../config';
import { TimestampToDatePipe } from '../../pipes/timestamp-to-date.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StarsComponent } from '../stars/stars.component';
import { DeadlineEditorComponent } from '../deadline-editor/deadline-editor.component';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DeadlineService } from '../../services/deadline.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface DialogData {
  deadline: Deadline;
}

@Component({
  selector: 'app-deadline-details',
  standalone: true,
  imports: [TimestampToDatePipe, MatIconModule, MatButtonModule, MatDialogModule, StarsComponent],
  templateUrl: './deadline-details.component.html',
  styleUrl: './deadline-details.component.css',
})
export class DeadlineDetailsComponent implements OnInit, OnDestroy {
  data = inject(MAT_DIALOG_DATA) as DialogData;

  user!: User;
  sub = new Subscription();
  examTypes = ExamType;
  stars: number[] = [];

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private deadlineService: DeadlineService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DeadlineDetailsComponent>,
  ) {}

  ngOnInit(): void {
    this.sub = this.authService.userData.subscribe((user) => {
      this.user = user!;
    });
  }

  editDeadline(): void {
    if (this.dialog.openDialogs.length > 1) return;

    this.dialog
      .open(DeadlineEditorComponent, {
        data: {
          user: this.user,
          deadline: this.data.deadline,
        },
        width: `${DEADLINE_EDITOR_DIALOG_WIDTH}px`,
      })
      .afterClosed()
      .subscribe((deadline) => {
        if (deadline) {
          this.data.deadline = deadline;
        }
      });
  }

  deleteDeadline(): void {
    if (this.dialog.openDialogs.length > 1) return;

    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          message: 'Biztos?',
        },
        width: '200px',
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;

        const observer = {
          next: () => {
            this.snackBar.open('Sikeres törlés!', undefined, successSnackbarConfig);
            this.dialogRef.close();
          },
          error: (error: Error) => {
            this.snackBar.open('Sikertelen törlés!', undefined, errorSnackbarConfig);
            console.error(error);
          },
        };

        if (this.data.deadline.isPersonal) {
          this.deadlineService.deletePersonalDeadline(this.user, this.data.deadline).subscribe(observer);
        } else {
          this.deadlineService.deleteCommonDeadline(this.data.deadline).subscribe(observer);
        }
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
