export interface UpdateUserPasswordRequest {
  currentPassword: string,
  newPassword: string,
  passwordConfirmationNonce: string | null
}

