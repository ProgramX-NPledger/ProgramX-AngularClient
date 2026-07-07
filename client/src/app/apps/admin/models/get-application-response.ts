
import {Role} from './role';
import {Application} from '../../../core/models/application';


export interface GetApplicationResponse {
  application: Application,
  usedInRoles: Role[];
}
