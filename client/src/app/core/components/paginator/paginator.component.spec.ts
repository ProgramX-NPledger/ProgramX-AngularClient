
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PaginatorComponent } from './paginator.component';
import { PagedData } from '../model/paged-data';
import { PageWithUrl } from '../model/page-with-url';

interface TestUser {
  id: number;
  name: string;
}

describe('PaginatorComponent', () => {
  let component: PaginatorComponent<TestUser>;
  let fixture: ComponentFixture<PaginatorComponent<TestUser>>;

  const createMockPagedData = (totalItems: number, itemsPerPage: number = 5): PagedData<TestUser> => {
    const items: TestUser[] = Array.from({ length: Math.min(itemsPerPage, totalItems) },
      (_, i) => ({ id: i + 1, name: `User ${i + 1}` }));

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagesWithUrls: PageWithUrl[] = Array.from({ length: totalPages },
      (_, i) => new PageWithUrl(`/page/${i + 1}`, false, i + 1));

    const pagedData = new PagedData<TestUser>(
      items,
      undefined,
      itemsPerPage,
      false,
      10.5,
      250,
      totalItems
    );
    pagedData.pagesWithUrls = pagesWithUrls;

    return pagedData;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent<TestUser>);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.currentPageNumber).toBe(1);
      expect(component.maxVisiblePages).toBe(5);
      expect(component.pagedData).toBeUndefined();
    });
  });

  describe('totalPagesCount getter', () => {
    it('should return 0 when pagedData is undefined', () => {
      component.pagedData = undefined;
      expect(component.totalPagesCount).toBe(0);
    });

    it('should calculate correct total pages count', () => {
      component.pagedData = createMockPagedData(23, 5);
      expect(component.totalPagesCount).toBe(5); // Math.ceil(23/5) = 5
    });

    it('should handle exact division', () => {
      component.pagedData = createMockPagedData(20, 5);
      expect(component.totalPagesCount).toBe(4); // 20/5 = 4
    });

    it('should handle single page', () => {
      component.pagedData = createMockPagedData(3, 5);
      expect(component.totalPagesCount).toBe(1);
    });
  });

  describe('startPage getter', () => {
    beforeEach(() => {
      component.pagedData = createMockPagedData(50, 5); // 10 total pages
      component.maxVisiblePages = 5;
    });

    it('should return 1 when current page is near the beginning', () => {
      component.currentPageNumber = 1;
      expect(component.startPage).toBe(1);

      component.currentPageNumber = 2;
      expect(component.startPage).toBe(1);

      component.currentPageNumber = 3;
      expect(component.startPage).toBe(1);
    });

    it('should adjust startPage for middle pages', () => {
      component.currentPageNumber = 5;
      expect(component.startPage).toBe(3); // 5 - Math.floor(5/2) = 3

      component.currentPageNumber = 7;
      expect(component.startPage).toBe(5); // 7 - 2 = 5
    });

    it('should not go below 1', () => {
      component.currentPageNumber = 1;
      expect(component.startPage).toBe(1);
    });
  });

  describe('endPage getter', () => {
    beforeEach(() => {
      component.pagedData = createMockPagedData(50, 5); // 10 total pages
      component.maxVisiblePages = 5;
    });

    it('should calculate correct end page for beginning pages', () => {
      component.currentPageNumber = 1;
      expect(component.endPage).toBe(5); // min(10, 1 + 5 - 1) = 5
    });

    it('should not exceed total pages count', () => {
      component.currentPageNumber = 10;
      expect(component.endPage).toBe(10); // min(10, 8 + 5 - 1) = 10
    });

    it('should handle small datasets', () => {
      component.pagedData = createMockPagedData(8, 5); // 2 total pages
      component.currentPageNumber = 1;
      expect(component.endPage).toBe(2);
    });
  });

  describe('visiblePages getter', () => {
    it('should return empty array when pagedData is undefined', () => {
      component.pagedData = undefined;
      expect(component.visiblePages).toEqual([]);
    });

    it('should return correct visible pages for beginning', () => {
      component.pagedData = createMockPagedData(50, 5); // 10 total pages
      component.currentPageNumber = 1;
      component.maxVisiblePages = 5;

      const visiblePages = component.visiblePages;
      expect(visiblePages).toHaveSize(5);
      expect(visiblePages.map(p => p.pageNumber)).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return correct visible pages for middle', () => {
      component.pagedData = createMockPagedData(50, 5); // 10 total pages
      component.currentPageNumber = 6;
      component.maxVisiblePages = 5;

      const visiblePages = component.visiblePages;
      expect(visiblePages).toHaveSize(5);
      expect(visiblePages.map(p => p.pageNumber)).toEqual([4, 5, 6, 7, 8]);
    });

    it('should return correct visible pages for end', () => {
      component.pagedData = createMockPagedData(50, 5); // 10 total pages
      component.currentPageNumber = 10;
      component.maxVisiblePages = 5;

      const visiblePages = component.visiblePages;
      expect(visiblePages).toHaveSize(3);
      expect(visiblePages.map(p => p.pageNumber)).toEqual([8, 9, 10]);
    });

    it('should handle datasets with fewer pages than maxVisiblePages', () => {
      component.pagedData = createMockPagedData(8, 5); // 2 total pages
      component.currentPageNumber = 1;
      component.maxVisiblePages = 5;

      const visiblePages = component.visiblePages;
      expect(visiblePages).toHaveSize(2);
      expect(visiblePages.map(p => p.pageNumber)).toEqual([1, 2]);
    });
  });

  describe('goToPage method', () => {
    beforeEach(() => {
      component.pagedData = createMockPagedData(25, 5); // 5 total pages
      spyOn(component.pageChange, 'emit');
    });

    it('should emit pageChange when valid page is provided', () => {
      component.currentPageNumber = 1;
      component.goToPage(3);

      expect(component.currentPageNumber).toBe(3);
      expect(component.pageChange.emit).toHaveBeenCalledWith(3);
    });

    it('should not emit when page is same as current', () => {
      component.currentPageNumber = 3;
      component.goToPage(3);

      expect(component.currentPageNumber).toBe(3);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should not emit when page is less than 1', () => {
      component.currentPageNumber = 2;
      component.goToPage(0);

      expect(component.currentPageNumber).toBe(2);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should not emit when page exceeds total pages', () => {
      component.currentPageNumber = 3;
      component.goToPage(10);

      expect(component.currentPageNumber).toBe(3);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should not emit when pagedData is undefined', () => {
      component.pagedData = undefined;
      component.currentPageNumber = 1;
      component.goToPage(2);

      expect(component.currentPageNumber).toBe(1);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should handle boundary values correctly', () => {
      component.currentPageNumber = 2;

      // Go to first page
      component.goToPage(1);
      expect(component.currentPageNumber).toBe(1);
      expect(component.pageChange.emit).toHaveBeenCalledWith(1);

      // Reset spy
      (component.pageChange.emit as jasmine.Spy).calls.reset();

      // Go to last page
      component.goToPage(5);
      expect(component.currentPageNumber).toBe(5);
      expect(component.pageChange.emit).toHaveBeenCalledWith(5);
    });
  });

  describe('Template Rendering', () => {
    it('should not render when pagedData is undefined', () => {
      component.pagedData = undefined;
      fixture.detectChanges();

      const paginationElement = fixture.debugElement.query(By.css('.join'));
      expect(paginationElement).toBeNull();
    });

    it('should not render when totalPagesCount is 0', () => {
      component.pagedData = createMockPagedData(0, 5);
      fixture.detectChanges();

      const paginationElement = fixture.debugElement.query(By.css('.join'));
      expect(paginationElement).toBeNull();
    });

    it('should render pagination controls when data is available', () => {
      component.pagedData = createMockPagedData(25, 5);
      component.currentPageNumber = 1;
      fixture.detectChanges();

      const paginationElement = fixture.debugElement.query(By.css('.join'));
      expect(paginationElement).toBeTruthy();

      const previousBtn = fixture.debugElement.query(By.css('button[aria-label="Go to previous page"]'));
      const nextBtn = fixture.debugElement.query(By.css('button[aria-label="Go to next page"]'));

      expect(previousBtn).toBeTruthy();
      expect(nextBtn).toBeTruthy();
    });

    it('should disable Previous button on first page', () => {
      component.pagedData = createMockPagedData(25, 5);
      component.currentPageNumber = 1;
      fixture.detectChanges();

      const previousBtn = fixture.debugElement.query(By.css('button[aria-label="Go to previous page"]'));
      expect(previousBtn.nativeElement.disabled).toBeTruthy();
    });

    it('should disable Next button on last page', () => {
      component.pagedData = createMockPagedData(25, 5);
      component.currentPageNumber = 5;
      fixture.detectChanges();

      const nextBtn = fixture.debugElement.query(By.css('button[aria-label="Go to next page"]'));
      expect(nextBtn.nativeElement.disabled).toBeTruthy();
    });

    it('should render visible page numbers', () => {
      component.pagedData = createMockPagedData(25, 5);
      component.currentPageNumber = 3;
      fixture.detectChanges();

      const pageButtons = fixture.debugElement.queryAll(By.css('.join-item.btn:not([aria-label*="previous"]):not([aria-label*="next"])'));
      const visiblePageNumbers = pageButtons
        .filter(btn => !btn.nativeElement.textContent.includes('...') && !isNaN(parseInt(btn.nativeElement.textContent.trim())))
        .map(btn => parseInt(btn.nativeElement.textContent.trim()));

      expect(visiblePageNumbers).toContain(1);
      expect(visiblePageNumbers).toContain(2);
      expect(visiblePageNumbers).toContain(3);
      expect(visiblePageNumbers).toContain(4);
      expect(visiblePageNumbers).toContain(5);
    });

    it('should highlight current page', () => {
      component.pagedData = createMockPagedData(25, 5);
      component.currentPageNumber = 3;
      fixture.detectChanges();

      const activePageBtn = fixture.debugElement.query(By.css('.btn-active'));
      expect(activePageBtn).toBeTruthy();
      expect(activePageBtn.nativeElement.textContent.trim()).toBe('3');
    });

    it('should show ellipsis when pages are skipped', () => {
      component.pagedData = createMockPagedData(100, 5); // 20 total pages
      component.currentPageNumber = 10;
      component.maxVisiblePages = 5;
      fixture.detectChanges();

      const ellipsis = fixture.debugElement.queryAll(By.css('.btn-disabled'));
      expect(ellipsis.length).toBeGreaterThan(0);
      expect(ellipsis.some(el => el.nativeElement.textContent.includes('...'))).toBeTruthy();
    });

    it('should render performance metrics', () => {
      const pagedData = createMockPagedData(25, 5);
      pagedData.requestCharge = 15.75;
      pagedData.timeDeltaMs = 350;
      pagedData.totalItems = 25;

      component.pagedData = pagedData;
      fixture.detectChanges();

      const badges = fixture.debugElement.queryAll(By.css('.badge'));
      const badgeTexts = badges.map(badge => badge.nativeElement.textContent.trim());

      expect(badgeTexts).toContain('15.75 RUs');
      expect(badgeTexts).toContain('350ms');
      expect(badgeTexts).toContain('25 items');
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      component.pagedData = createMockPagedData(25, 5);
      spyOn(component.pageChange, 'emit');
    });

    it('should call goToPage when Previous button is clicked', () => {
      component.currentPageNumber = 3;
      fixture.detectChanges();

      const previousBtn = fixture.debugElement.query(By.css('button[aria-label="Go to previous page"]'));
      previousBtn.nativeElement.click();

      expect(component.pageChange.emit).toHaveBeenCalledWith(2);
    });

    it('should call goToPage when Next button is clicked', () => {
      component.currentPageNumber = 2;
      fixture.detectChanges();

      const nextBtn = fixture.debugElement.query(By.css('button[aria-label="Go to next page"]'));
      nextBtn.nativeElement.click();

      expect(component.pageChange.emit).toHaveBeenCalledWith(3);
    });

    it('should call goToPage when page number button is clicked', () => {
      component.currentPageNumber = 1;
      fixture.detectChanges();

      const pageButtons = fixture.debugElement.queryAll(By.css('.join-item.btn'));
      const page3Button = pageButtons.find(btn =>
        btn.nativeElement.textContent.trim() === '3' &&
        !btn.nativeElement.getAttribute('aria-label')?.includes('previous') &&
        !btn.nativeElement.getAttribute('aria-label')?.includes('next')
      );

      expect(page3Button).toBeTruthy();
      page3Button!.nativeElement.click();

      expect(component.pageChange.emit).toHaveBeenCalledWith(3);
    });

    it('should call goToPage when first page button is clicked', () => {
      component.pagedData = createMockPagedData(100, 5); // 20 total pages
      component.currentPageNumber = 10;
      fixture.detectChanges();

      const firstPageBtn = fixture.debugElement.query(By.css('button[aria-label="Go to page 1"]'));
      expect(firstPageBtn).toBeTruthy();
      firstPageBtn.nativeElement.click();

      expect(component.pageChange.emit).toHaveBeenCalledWith(1);
    });

    it('should call goToPage when last page button is clicked', () => {
      component.pagedData = createMockPagedData(100, 5); // 20 total pages
      component.currentPageNumber = 10;
      fixture.detectChanges();

      const lastPageBtn = fixture.debugElement.query(By.css(`button[aria-label="Go to page 20"]`));
      expect(lastPageBtn).toBeTruthy();
      lastPageBtn.nativeElement.click();

      expect(component.pageChange.emit).toHaveBeenCalledWith(20);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single page dataset', () => {
      component.pagedData = createMockPagedData(3, 5); // Only 1 page
      component.currentPageNumber = 1;
      fixture.detectChanges();

      const previousBtn = fixture.debugElement.query(By.css('button[aria-label="Go to previous page"]'));
      const nextBtn = fixture.debugElement.query(By.css('button[aria-label="Go to next page"]'));

      expect(previousBtn.nativeElement.disabled).toBeTruthy();
      expect(nextBtn.nativeElement.disabled).toBeTruthy();
    });

    it('should handle empty dataset', () => {
      component.pagedData = createMockPagedData(0, 5);
      fixture.detectChanges();

      const paginationElement = fixture.debugElement.query(By.css('.join'));
      expect(paginationElement).toBeNull();
    });

    it('should handle maxVisiblePages greater than total pages', () => {
      component.pagedData = createMockPagedData(15, 5); // 3 total pages
      component.maxVisiblePages = 10;
      component.currentPageNumber = 2;

      const visiblePages = component.visiblePages;
      expect(visiblePages).toHaveSize(3);
      expect(visiblePages.map(p => p.pageNumber)).toEqual([1, 2, 3]);
    });

    it('should handle maxVisiblePages of 1', () => {
      component.pagedData = createMockPagedData(25, 5);
      component.maxVisiblePages = 1;
      component.currentPageNumber = 3;

      const visiblePages = component.visiblePages;
      expect(visiblePages).toHaveSize(1);
      expect(visiblePages.map(p => p.pageNumber)).toEqual([3]);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      component.pagedData = createMockPagedData(25, 5);
      component.currentPageNumber = 3;
      fixture.detectChanges();
    });

    it('should have proper ARIA labels', () => {
      const navigationElement = fixture.debugElement.query(By.css('[role="navigation"]'));
      expect(navigationElement.nativeElement.getAttribute('aria-label')).toBe('Pagination');

      const previousBtn = fixture.debugElement.query(By.css('button[aria-label="Go to previous page"]'));
      const nextBtn = fixture.debugElement.query(By.css('button[aria-label="Go to next page"]'));

      expect(previousBtn.nativeElement.getAttribute('aria-label')).toBe('Go to previous page');
      expect(nextBtn.nativeElement.getAttribute('aria-label')).toBe('Go to next page');
    });

    it('should set aria-current="page" for current page', () => {
      const currentPageBtn = fixture.debugElement.query(By.css('[aria-current="page"]'));
      expect(currentPageBtn).toBeTruthy();
      expect(currentPageBtn.nativeElement.textContent.trim()).toBe('3');
    });

    // it('should have aria-label for page buttons', () => {
    //   const pageButtons = fixture.debugElement.queryAll(By.css('button[aria-label*="Go to page"]'));
    //   expect(pageButtons.length).toBeGreaterThan(0);
    //
    //   pageButtons.forEach(button => {
    //     const ariaLabel = button.nativeElement.getAttribute('aria-label');
    //     expect(ariaLabel).toMatch(/Go to page \d+/);
    //   });
    // });
  });
});
