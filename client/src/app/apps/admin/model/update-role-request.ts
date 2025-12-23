import {Role} from './role';
import {User} from '../../../model/user';

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  users?: User[] | undefined;
}

