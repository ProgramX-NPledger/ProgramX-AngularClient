import { SecureUser } from "./secure-user";

export interface UsersResponse {
    isLastPage: boolean;
    itemsPerPage: number;
    continuationToken?: string;
    items: SecureUser[];
}
     