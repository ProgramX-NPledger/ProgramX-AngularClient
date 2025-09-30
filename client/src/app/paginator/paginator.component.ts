import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
  standalone: true,
})
export class PaginatorComponent {
  @Input() items: any[] | null = null;
  @Input() estimatedTotalPageCount: number = 0;
  @Input() currentPageNumber: number = 1;
  @Input() maxVisiblePages: number = 5;
  @Output() pageChange = new EventEmitter<number>();


  get visiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.startPage);
    const end = Math.min(this.estimatedTotalPageCount, this.endPage);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  get startPage(): number {
    return Math.max(1, this.currentPageNumber - Math.floor(this.maxVisiblePages / 2));
  }

  get endPage(): number {
    return Math.min(
      this.estimatedTotalPageCount,
      this.startPage + this.maxVisiblePages - 1
    );
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.estimatedTotalPageCount && page !== this.currentPageNumber) {
      this.pageChange.emit(page);
    }
  }


}
