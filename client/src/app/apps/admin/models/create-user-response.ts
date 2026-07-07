import {Role} from './role';

export interface CreateUserResponse {
  id: string;
  emailAddress: string;
  userName: string;
  roles: Role[];
  versionNumber: number;
  createdAt: Date;
  updatedAt: Date;
  theme: string;
  firstName: string;
  lastName: string;
  lastLoginAt: Date | null;
  lastPasswordChangedAt: Date | null;
  passwordLinkExpiresAt: Date | null;
}
