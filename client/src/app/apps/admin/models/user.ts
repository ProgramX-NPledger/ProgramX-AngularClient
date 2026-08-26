export interface User {
    userName: string;
    roles: string[];
    firstName: string;
    lastName: string;
    emailAddress: string;
    profilePhotographOriginal?: string;
    theme: string;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
    lastPasswordChangedAt: Date;
    passwordLinkExpiresAt: Date;
}
