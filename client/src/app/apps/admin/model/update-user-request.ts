export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  userName?: string;
  newPassword?: string;
  updateProfileScope?: boolean;
  updatePasswordScope?: boolean;
  updateSettingsScope?: boolean;
  theme?: string;
  passwordConfirmationNonce?: string;
}

