import {Role} from './role';

export interface UpdateUserResponse {
  isOk: boolean;
  errorMessage?: string;
  userName: string;
}
