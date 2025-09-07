export interface CreateUserRequest {
  emailAddress: string;
  userName: string;
  firstName: string;
  lastName: string;
  addToRoles: string[];
  passwordConfirmationLinkExpiryDate : Date;
}
