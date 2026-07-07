export interface LoginResponse {
  userName: string;
  emailAddress: string;
  memberOfRoles: string[];
  token: string;
  canUseApplications: string[];
  profilePhotoBase64: string | null;
  firstName: string;
  lastName: string;
  initials: string;
  profilePhotographSmall: string | null;
}
