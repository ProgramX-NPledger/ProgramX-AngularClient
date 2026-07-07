import { PageWithUrl } from "./page-with-url";

export class PagedData<T> {
  items: T[]=[];
  pagesWithUrls: PageWithUrl[]=[];
  continuationToken?: string;
  itemsPerPage: number;
  isLastPage?: boolean;
  requestCharge?: number;
  timeDeltaMs?: number;
  totalItems: number;

  constructor(items: T[], continuationToken?: string, itemsPerPage: number = 10, isLastPage?: boolean, requestCharge?: number, timeDeltaMs?: number, totalItems: number = 0) {
    this.items = items;
    this.continuationToken = continuationToken;
    this.itemsPerPage = itemsPerPage;
    this.isLastPage = isLastPage;
    this.requestCharge = requestCharge;
    this.timeDeltaMs = timeDeltaMs;
    this.totalItems = totalItems;
  }
}
