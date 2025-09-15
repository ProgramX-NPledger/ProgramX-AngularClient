import {Role} from './role';
import {Application} from './application';
import {User} from '../../../model/user';

export interface CreateRoleResponse {
  id: string;
  name: string;
  description: string;
  users: User[];
  applications: Application[];
  versionNumber: number;
  createdAt: Date;
  updatedAt: Date;
}
