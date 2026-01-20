import {
  Component,
  input,
  output,
  computed,
  signal,
  TemplateRef,
  ContentChild,
  effect,
  untracked,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TableColumn, LazyLoadEvent, PageChangeEvent } from './data-table.types';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  standalone: true,
  imports: [NgTemplateOutlet],
})
export class DataTableComponent<T = unknown> {
  // Data inputs
  data = input.required<T[]>();
  columns = input.required<TableColumn<T>[]>();

  // Pagination inputs
  rows = input<number>(10);
  rowsPerPageOptions = input<number[]>([10, 25, 50]);
  paginator = input<boolean>(true);
  showCurrentPageReport = input<boolean>(true);

  // Lazy loading inputs (server-side pagination)
  lazy = input<boolean>(false);
  totalRecords = input<number | null>(null);
  first = input<number>(0);

  // UI inputs
  loading = input<boolean>(false);
  emptyMessage = input<string>('No data found.');
  rowHover = input<boolean>(true);

  // Custom templates
  @ContentChild('headerTemplate') headerTemplate?: TemplateRef<unknown>;
  @ContentChild('bodyTemplate') bodyTemplate?: TemplateRef<{ $implicit: T }>;
  @ContentChild('emptyTemplate') emptyTemplate?: TemplateRef<unknown>;

  // Outputs
  rowClick = output<T>();
  lazyLoad = output<LazyLoadEvent>();
  pageChange = output<PageChangeEvent>();

  // Internal state
  currentPage = signal(0);
  currentRows = computed(() => this._currentRows() ?? this.rows());
  private _currentRows = signal<number | null>(null);

  constructor() {
    // Sync currentPage when first input changes (for external control)
    // Use untracked for currentPage to prevent the effect from re-running
    // when currentPage changes (which would reset it back)
    effect(() => {
      const first = this.first();
      const rows = this.currentRows();
      const page = Math.floor(first / rows);
      if (untracked(() => this.currentPage()) !== page) {
        this.currentPage.set(page);
      }
    });
  }

  setCurrentRows(rows: number): void {
    this._currentRows.set(rows);
  }

  // Computed values
  totalPages = computed(() => {
    const total = this.lazy() ? (this.totalRecords() ?? 0) : this.data().length;
    return Math.ceil(total / this.currentRows());
  });

  paginatedData = computed(() => {
    if (this.lazy()) {
      return this.data();
    }
    const start = this.currentPage() * this.currentRows();
    return this.data().slice(start, start + this.currentRows());
  });

  displayedRecords = computed(() => {
    const total = this.lazy() ? (this.totalRecords() ?? 0) : this.data().length;
    if (total === 0) return { first: 0, last: 0, total: 0 };

    const first = this.currentPage() * this.currentRows() + 1;
    const last = Math.min(first + this.currentRows() - 1, total);
    return { first, last, total };
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    // Show max 5 page numbers centered around current page
    let start = Math.max(0, current - 2);
    const end = Math.min(total, start + 5);

    // Adjust start if we're near the end
    if (end - start < 5) {
      start = Math.max(0, end - 5);
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  });

  // Methods
  onRowClick(item: T): void {
    this.rowClick.emit(item);
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;
    this.currentPage.set(page);
    this.emitPageChange();
  }

  goToFirstPage(): void {
    this.goToPage(0);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages() - 1);
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  onRowsChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newRows = parseInt(select.value, 10);

    this.setCurrentRows(newRows);
    this.currentPage.set(0);
    this.emitPageChange();
  }

  getCellValue(item: T, field: string | keyof T): unknown {
    const fieldPath = String(field).split('.');
    let value: unknown = item;
    for (const key of fieldPath) {
      if (value === null || value === undefined) return '';
      value = (value as Record<string, unknown>)[key];
    }
    return value ?? '';
  }

  private emitPageChange(): void {
    const event: PageChangeEvent = {
      page: this.currentPage(),
      rows: this.currentRows(),
      first: this.currentPage() * this.currentRows(),
    };
    this.pageChange.emit(event);

    if (this.lazy()) {
      this.lazyLoad.emit({
        first: event.first,
        rows: event.rows,
      });
    }
  }
}
