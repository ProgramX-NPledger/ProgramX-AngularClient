export class PageWithUrl {
  url: string;
  isCurrentPage: boolean;
  pageNumber: number;

  constructor(url: string, isCurrentPage: boolean, pageNumber: number) {
    this.url = url;
    this.isCurrentPage = isCurrentPage;
    this.pageNumber = pageNumber;
  }
}
