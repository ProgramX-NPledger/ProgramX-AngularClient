import { SecureUser } from "./secure-user";

export interface GetUsersResponse {
    isLastPage: boolean;
    itemsPerPage: number;
    continuationToken?: string;
    items: SecureUser[];
    nextPageUrl?: string;
    requestCharge?: number;
    estimatedTotalPageCount: number;
}
