import {FormArray, FormGroup} from '@angular/forms';
import {Application} from './application';

export interface SelectableRole {
  isSelected: boolean;
  name: string;
  description: string;
  applications: Application[];
}
