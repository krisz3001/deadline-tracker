import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Deadline } from '../../interfaces/deadline.interface';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { errorSnackbarConfig, ExamType, successSnackbarConfig } from '../../config';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { Timestamp } from '@angular/fire/firestore';
import { DeadlineService } from '../../services/deadline.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../interfaces/user.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface DialogData {
  user: User;
  deadline?: Deadline;
}

@Component({
  selector: 'app-deadline-editor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatDialogModule,
    MatSliderModule,
    MatRadioModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
  templateUrl: './deadline-editor.component.html',
  styleUrl: './deadline-editor.component.css',
})
export class DeadlineEditorComponent implements OnInit {
  form = new FormGroup({
    date: new FormControl<Date | null>(null, [Validators.required]),
    type: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    comments: new FormControl(''),
    severity: new FormControl(1, [Validators.required]),
    isPersonal: new FormControl<boolean | null>(null, [Validators.required]),
  });

  data = inject(MAT_DIALOG_DATA) as DialogData;

  examTypes = ExamType;
  examTypeKeys = Object.keys(ExamType) as (keyof typeof ExamType)[];
  submitting = false;

  constructor(
    private deadlineService: DeadlineService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DeadlineEditorComponent>,
  ) {}

  ngOnInit(): void {
    if (this.data.deadline) {
      this.form.patchValue({
        date: this.data.deadline.date.toDate(),
        type: this.data.deadline.type,
        subject: this.data.deadline.subject,
        comments: this.data.deadline.comments,
        severity: this.data.deadline.severity,
        isPersonal: this.data.deadline.isPersonal,
      });
    }
  }

  submit(): void {
    if (this.isPersonal.hasError('required')) {
      this.isPersonal.markAsTouched();
    }
    if (this.form.invalid) return;
    if (this.submitting) return;

    this.submitting = true;

    const deadline: Deadline = {
      ...this.data.deadline,
      date: Timestamp.fromDate(new Date(this.date.value!)),
      type: this.type.value! as keyof typeof ExamType,
      subject: this.subject.value!,
      comments: this.comments.value!,
      severity: this.severity.value!,
      isPersonal: this.isPersonal.value!,
    } as Deadline;

    if (this.data.deadline) {
      this.edit(deadline);
    } else {
      deadline.creator = this.data.user.fullname;
      deadline.isCompleted = false;
      this.add(deadline);
    }
  }

  add(deadline: Deadline): void {
    const observer = {
      next: () => {
        this.snackBar.open('Sikeres hozzáadás!', undefined, successSnackbarConfig);
        this.submitting = false;
        this.dialogRef.close();
      },
      error: (error: Error) => {
        this.snackBar.open('Sikertelen hozzáadás!', undefined, errorSnackbarConfig);
        this.submitting = false;
        console.error(error);
      },
    };

    if (this.isPersonal.value) {
      this.deadlineService.addPersonalDeadline(this.data.user, deadline).subscribe(observer);
    } else {
      this.deadlineService.addCommonDeadline(deadline).subscribe(observer);
    }
  }

  edit(deadline: Deadline): void {
    const observer = {
      next: () => {
        this.snackBar.open('Sikeres szerkesztés!', undefined, successSnackbarConfig);
        this.submitting = false;
        this.dialogRef.close(deadline);
      },
      error: (error: Error) => {
        this.snackBar.open('Sikertelen szerkesztés!', undefined, errorSnackbarConfig);
        this.submitting = false;
        console.error(error);
      },
    };

    if (this.isPersonal.value === this.data.deadline!.isPersonal) {
      this.saveDeadline(deadline, observer);
    }

    if (this.isPersonal.value) {
      this.deadlineService.saveAndTransferToUser(deadline, this.data.user).subscribe(observer);
    } else {
      this.deadlineService.saveAndTransferToCommon(deadline).subscribe(observer);
    }
  }

  saveDeadline(deadline: Deadline, observer: {}): void {
    if (this.isPersonal.value) {
      this.deadlineService.editPersonalDeadline(this.data.user, deadline).subscribe(observer);
    } else {
      this.deadlineService.editCommonDeadline(deadline).subscribe(observer);
    }
  }

  get date() {
    return this.form.get('date')!;
  }

  get type() {
    return this.form.get('type')!;
  }

  get subject() {
    return this.form.get('subject')!;
  }

  get comments() {
    return this.form.get('comments')!;
  }

  get severity() {
    return this.form.get('severity')!;
  }

  get isPersonal() {
    return this.form.get('isPersonal')!;
  }
}
