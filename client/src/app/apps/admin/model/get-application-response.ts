
import {Role} from './role';
import {Application} from '../../../model/application';


export interface GetApplicationResponse {
  application: Application,
  usedInRoles: Role[];
}
