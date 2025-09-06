export interface UserResponse {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    profilePhotographSmall?: string;
    theme: string;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
    lastPasswordChangedAt: Date;
    passwordLinkExpiresAt: Date;
}
