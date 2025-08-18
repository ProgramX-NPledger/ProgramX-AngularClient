import { Role } from "./role";

export interface SecureUser {
    id: string;
    emailAddress: string;
    userName: string;
    roles: Role[];
    type: string;
    versionNumber: number;

}