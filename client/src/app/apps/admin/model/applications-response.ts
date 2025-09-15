import {Application} from './application';


export interface ApplicationsResponse {
    isLastPage: boolean;
    itemsPerPage: number;
    continuationToken?: string;
    items: Application[];
}
