// TypeScript
import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[matchValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MatchValidatorDirective,
      multi: true,
    },
  ],
})
export class MatchValidatorDirective implements Validator {
  @Input('matchValidator') matchTo?: string; // value to match (passed from template)

  validate(control: AbstractControl): ValidationErrors | null {
    if (control == null) return null;
    const value = control.value;
    const other = this.matchTo;
    console.log(`Control Value: ${control.value}, Match To: ${this.matchTo}`);
    if (other == null || other === '') return null; // nothing to compare yet
    console.log(value === other ? { match: false } : { match: true });
    return value === other ? { match: false } : { match: true };
  }

  registerOnValidatorChange?(fn: () => void): void {}
}
