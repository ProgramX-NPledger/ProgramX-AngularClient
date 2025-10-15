import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PageWithUrl} from '../model/page-with-url';
import {PagedData} from '../model/paged-data';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
  standalone: true,
})
export class PaginatorComponent<T> {
  @Input() pagedData: PagedData<T> | undefined;
  @Input() currentPageNumber: number = 1;
  @Output() pageChange = new EventEmitter<number>();
  @Input() maxVisiblePages: number = 5;

  get totalPagesCount(): number {
    if (this.pagedData) {
      return Math.ceil(this.pagedData.totalItems / this.pagedData.itemsPerPage)
    }
    return 0;
  }

  get visiblePages(): PageWithUrl[] {
    if (this.pagedData) {
      const pages: PageWithUrl[] = [];
      const start = Math.max(1, this.startPage);
      const end = Math.min(this.totalPagesCount, this.endPage);

      for (let i = start-1; i < end; i++) {
        pages.push(this.pagedData.pagesWithUrls[i]);
      }
      return pages;
    }
    return [];
  }

  get startPage(): number {
    return Math.max(1, this.currentPageNumber - Math.floor(this.maxVisiblePages / 2));
  }

  get endPage(): number {
    return Math.min(
      this.totalPagesCount,
      this.startPage + this.maxVisiblePages - 1
    );
  }

  goToPage(page: number): void {
    if (this.pagedData) {
      if (page >= 1 && page <= Math.ceil(this.pagedData.totalItems / this.pagedData.itemsPerPage) && page !== this.currentPageNumber) {
        this.currentPageNumber = page;
        this.pageChange.emit(page);
      }
    }
  }


}
