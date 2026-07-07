import {Role} from './role';

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  userName?: string;
  newPassword?: string;
  updateProfileScope?: boolean;
  updateRolesScope?: boolean;
  updatePasswordScope?: boolean;
  updateSettingsScope?: boolean;
  theme?: string;
  passwordConfirmationNonce?: string;
  roles?: Role[] | undefined;
}

