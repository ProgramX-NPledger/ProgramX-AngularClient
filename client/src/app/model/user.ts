import { Application } from "./application";

export interface User {
  userName: string;
  emailAddress: string;
  roles: string[];
  token: string;
  applications: Application[];
}
