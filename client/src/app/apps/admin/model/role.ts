import { Application } from "./application";

export interface Role {
    name: string;
    description: string;
    type: string;
    versionNumber: number;
    applications: Application[];
}