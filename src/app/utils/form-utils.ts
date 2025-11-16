import { FormGroup } from '@angular/forms';

export function getErrorClass(form: FormGroup, controlName: string): string {
  const control = form.get(controlName);
  return control?.touched && control?.invalid ? 'input-error' : '';
}
