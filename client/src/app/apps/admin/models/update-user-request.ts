import {Role} from './role';

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  roles?: Role[] | null;
}

