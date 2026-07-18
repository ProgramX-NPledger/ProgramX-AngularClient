// TypeScript
import { Directive, Input, OnChanges } from '@angular/core';
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
  standalone: true,
})
export class MatchValidatorDirective implements Validator, OnChanges {
  @Input('matchValidator') matchTo?: string;

  private onChange?: () => void;

  ngOnChanges(): void {
    this.onChange?.();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (control == null || control.value == null) return null;
    const value = control.value;
    const other = this.matchTo;
    if (other == null || other === '') return null;
    return value === other ? null : { match: true };
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }
}
