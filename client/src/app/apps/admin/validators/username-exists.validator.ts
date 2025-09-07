// TypeScript
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { inject } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {UsersService} from '../services/users-service.service';

export function userNameExistsValidator(debounceMs = 300): AsyncValidatorFn {
  const usersService = inject(UsersService);

  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = (control.value ?? '').trim();
    if (!value) return of(null); // don’t validate empty

    // Debounce to limit requests while typing
    return timer(debounceMs).pipe(
      switchMap(() => usersService.getUser(value)),
      map(exists => (exists!=null ? { userNameTaken: true } : null)),
      catchError((error) => {
        return of(null)
      })
    );
  };
}
