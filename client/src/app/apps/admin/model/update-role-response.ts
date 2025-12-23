import {Role} from './role';

export interface UpdateRoleResponse {
  isOk: boolean;
  errorMessage?: string;
  name: string;
}
