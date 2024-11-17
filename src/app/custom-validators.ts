import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static MatchingPasswords(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')!.value;
    const passwordConfirm = control.get('passwordConfirm')!.value;
    const confirmControl = control.get('passwordConfirm')!;
    const currentErrors = confirmControl.errors;

    if (compare(password, passwordConfirm)) {
      confirmControl.setErrors({ ...currentErrors, mismatch: true });
    } else {
      currentErrors && delete currentErrors['mismatch'];
      currentErrors && confirmControl.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
    }

    return null;
  }
}

function compare(password: string, passwordConfirm: string) {
  return password !== passwordConfirm && passwordConfirm !== '';
}
