export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  userName?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  updateProfileScope?: boolean;
  updatePasswordScope?: boolean;
  updateSettingsScope?: boolean;
  theme?: string;
}

