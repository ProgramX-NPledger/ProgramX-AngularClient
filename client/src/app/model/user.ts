import {FullyQualifiedApplication} from './fully-qualified-application';

export interface User {
  userName: string;
  emailAddress: string;
  roles: string[];
  token: string;
  applications: FullyQualifiedApplication[];
  firstName: string;
  lastName: string;
  initials: string;
  profilePhotographSmall: string;
}
