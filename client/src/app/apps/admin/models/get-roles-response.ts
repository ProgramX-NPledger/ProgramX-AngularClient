import {Role} from './role';

export interface GetRolesResponse {
  isLastPage: boolean;
  itemsPerPage: number;
  continuationToken?: string;
  items: Role[];
}
