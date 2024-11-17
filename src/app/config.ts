import { MatSnackBarConfig } from '@angular/material/snack-bar';

export const CONFIG = {
  PasswordMinLength: 8,
  PasswordMaxLength: 72,
};

export enum ExamType {
  EXAM = 'Vizsga',
  TEST = 'Zárthelyi',
  ASSIGNMENT = 'Beadandó',
  HOMEWORK = 'Házi feladat',
  PREEXAM = 'Elővizsga',
  FINAL = 'Záróvizsga',
  THESIS = 'Szakdolgozat',
  OTHER = 'Egyéb',
}

const SNACKBAR_DURATION = 3000;

export const errorSnackbarConfig: MatSnackBarConfig = {
  duration: SNACKBAR_DURATION,
  panelClass: ['snackbar-error'],
  horizontalPosition: 'left',
};

export const successSnackbarConfig: MatSnackBarConfig = {
  duration: SNACKBAR_DURATION,
  panelClass: ['snackbar-success'],
  horizontalPosition: 'left',
};

export const DEADLINE_EDITOR_DIALOG_WIDTH = 400;
export const DEADLINE_DETAILS_DIALOG_WIDTH = 500;
