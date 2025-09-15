import { Role } from "./role";

export interface SecureUser {
    id: string;
    emailAddress: string;
    userName: string;
    roles: Role[];
    type: string;
    versionNumber: number;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
    lastPasswordChangedAt: Date;
    passwordLinkExpiresAt: Date;
    firstName: string;
    lastName: string;
}
