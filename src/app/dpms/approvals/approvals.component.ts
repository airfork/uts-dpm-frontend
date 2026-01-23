import { Component, signal, inject, computed } from '@angular/core';
import { ApprovalsService } from '../../services/approvals.service';
import { FormatService } from '../../services/format.service';
import { first } from 'rxjs';
import ApprovalDpmDto from '../../models/approval-dpm-dto';
import { NotificationService } from '../../services/notification.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { UpperCasePipe } from '@angular/common';
import { BlockPipe } from '../../shared/pipes/BlockPipe';
import { DataTableComponent } from '../../ui/data-table/data-table.component';
import { TableColumn, LazyLoadEvent } from '../../ui/data-table/data-table.types';
import { PageHeaderComponent } from '../../ui/page-header/page-header.component';
import { EmptyStateComponent } from '../../ui/empty-state/empty-state.component';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css'],
  imports: [
    LoadingComponent,
    UpperCasePipe,
    BlockPipe,
    DataTableComponent,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
})
export class ApprovalsComponent {
  private approvalsService = inject(ApprovalsService);
  private formatService = inject(FormatService);
  private notificationService = inject(NotificationService);

  private lastLazyLoadEvent?: LazyLoadEvent;

  dpms = signal<ApprovalDpmDto[] | null>(null);
  loadingDpms = signal(true);
  totalRecords = signal(0);

  // Pagination state
  pageSize = signal(10);
  currentPage = signal(0);
  totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()));
  first = computed(() => this.currentPage() * this.pageSize());

  columns: TableColumn<ApprovalDpmDto>[] = [
    {
      field: 'driver',
      header: 'Driver',
      headerClass: 'w-2/5',
      cellClass: 'w-2/5',
    },
    {
      field: 'block',
      header: 'Block/Time',
      headerClass: 'w-1/5',
      cellClass: 'w-1/5',
    },
    { field: 'type', header: 'Type', headerClass: 'w-2/5', cellClass: 'w-2/5' },
  ];

  constructor() {
    // Trigger initial load
    this.lazyLoadEvent({ first: 0, rows: 10 });
  }

  // Expandable row state
  expandedDpmId = signal<number | null>(null);
  editingPoints = signal<{ [id: number]: number }>({});

  // Exit animation state
  removingDpmId = signal<number | null>(null);

  // Track known item IDs to prevent re-animation of existing items
  private knownDpmIds = new Set<number>();

  // Track initial page load for entrance animation
  private isInitialLoad = true;

  isNewItem(dpm: ApprovalDpmDto): boolean {
    // On initial load, all items should animate
    if (this.isInitialLoad) return true;
    return !this.knownDpmIds.has(dpm.id);
  }

  toggleExpand(dpm: ApprovalDpmDto) {
    if (this.expandedDpmId() === dpm.id) {
      this.expandedDpmId.set(null);
    } else {
      this.expandedDpmId.set(dpm.id);
      // Initialize edit value
      this.editingPoints.update((prev) => ({ ...prev, [dpm.id]: dpm.points }));
    }
  }

  isExpanded(dpm: ApprovalDpmDto): boolean {
    return this.expandedDpmId() === dpm.id;
  }

  getEditingPoints(dpm: ApprovalDpmDto): number {
    return this.editingPoints()[dpm.id] ?? dpm.points;
  }

  onPointsChange(dpm: ApprovalDpmDto, value: number) {
    this.editingPoints.update((prev) => ({ ...prev, [dpm.id]: value }));
  }

  savePoints(dpm: ApprovalDpmDto, event: Event) {
    event.stopPropagation();
    const newPoints = this.editingPoints()[dpm.id];
    if (newPoints === undefined || newPoints === dpm.points) return;

    dpm.points = newPoints;
    this.approvalsService
      .updatePoints(dpm.id, newPoints)
      .pipe(first())
      .subscribe(() => {
        this.notificationService.showSuccess('Points updated');
      });
  }

  approveDpm(dpm: ApprovalDpmDto, event: Event) {
    event.stopPropagation();
    this.expandedDpmId.set(null);
    this.removingDpmId.set(dpm.id);

    // Wait for exit animation, then remove
    setTimeout(() => {
      this.dpms.update((prev) => prev?.filter((dto) => dto.id !== dpm.id) ?? null);
      this.removingDpmId.set(null);
    }, 350);

    this.approvalsService
      .approveDpm(dpm.id)
      .pipe(first())
      .subscribe(() => {
        this.notificationService.showSuccess('DPM has been approved');
        this.reloadAfterRemoval();
      });
  }

  denyDpm(dpm: ApprovalDpmDto, event: Event) {
    event.stopPropagation();
    this.expandedDpmId.set(null);
    this.removingDpmId.set(dpm.id);

    // Wait for exit animation, then remove
    setTimeout(() => {
      this.dpms.update((prev) => prev?.filter((dto) => dto.id !== dpm.id) ?? null);
      this.removingDpmId.set(null);
    }, 350);

    this.approvalsService
      .denyDpm(dpm.id)
      .pipe(first())
      .subscribe(() => {
        this.notificationService.showSuccess('DPM has been denied');
        this.reloadAfterRemoval();
      });
  }

  /**
   * Reload data after removing an item, adjusting the page if needed.
   * If we removed the last item on a page > 0, go to the previous page.
   * Preserves scroll position and avoids jarring reload by keeping existing items visible.
   */
  private reloadAfterRemoval() {
    const page = this.currentPage();
    const size = this.pageSize();

    // Check if we removed the last item on this page (count was 1 before removal)
    // and we're not on page 0. Note: dpms() may still have the item if API
    // returned before the 250ms animation timeout, so check for <= 1
    const isLastItemOnPage = (this.dpms()?.length ?? 0) <= 1;

    // Save scroll position before reload
    const scrollY = window.scrollY;

    const event =
      isLastItemOnPage && page > 0
        ? { first: (page - 1) * size, rows: size }
        : this.lastLazyLoadEvent!;

    this.lastLazyLoadEvent = event;
    const newPage = event.first / size;

    this.pageSize.set(size);
    this.currentPage.set(newPage);

    // Don't show loading state - keep existing items visible for smooth transition
    this.approvalsService
      .getApprovalDpms(newPage, size)
      .pipe(first())
      .subscribe((pageData) => {
        // Don't clear knownDpmIds - this allows new items from page 2 to animate in
        // while existing items stay static
        this.dpms.set(pageData.content);
        this.totalRecords.set(pageData.totalElements);

        // Mark new items as known after a brief delay (after animation completes)
        setTimeout(() => {
          pageData.content.forEach((dpm) => this.knownDpmIds.add(dpm.id));
        }, 350);

        // Restore scroll position after data loads
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollY, behavior: 'instant' });
        });
      });
  }

  isRemoving(dpm: ApprovalDpmDto): boolean {
    return this.removingDpmId() === dpm.id;
  }

  lazyLoadEvent(event: LazyLoadEvent) {
    this.lastLazyLoadEvent = event;
    this.loadingDpms.set(true);
    const size = event.rows;
    const page = event.first / size;

    // Update mobile pagination state
    this.pageSize.set(size);
    this.currentPage.set(page);

    const wasInitialLoad = this.isInitialLoad;

    this.approvalsService
      .getApprovalDpms(page, size)
      .pipe(first())
      .subscribe((pageData) => {
        if (wasInitialLoad) {
          // On initial load, let items animate in first
          this.dpms.set(pageData.content);
          this.totalRecords.set(pageData.totalElements);
          this.loadingDpms.set(false);

          // After animation completes, mark items as known and clear initial load flag
          setTimeout(() => {
            this.isInitialLoad = false;
            pageData.content.forEach((dpm) => this.knownDpmIds.add(dpm.id));
          }, 500); // Allow stagger animation to complete
        } else {
          // Track all IDs as known (no animation on page navigation)
          this.knownDpmIds.clear();
          pageData.content.forEach((dpm) => this.knownDpmIds.add(dpm.id));

          this.dpms.set(pageData.content);
          this.totalRecords.set(pageData.totalElements);
          this.loadingDpms.set(false);
        }
      });
  }

  // Mobile pagination methods
  goToNextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      const nextPage = this.currentPage() + 1;
      this.lazyLoadEvent({
        first: nextPage * this.pageSize(),
        rows: this.pageSize(),
      });
    }
  }

  goToPrevPage() {
    if (this.currentPage() > 0) {
      const prevPage = this.currentPage() - 1;
      this.lazyLoadEvent({
        first: prevPage * this.pageSize(),
        rows: this.pageSize(),
      });
    }
  }

  get format() {
    return this.formatService;
  }

  // Helper methods for visual styling
  isPositiveDpm(dpm: ApprovalDpmDto): boolean {
    return dpm.points > 0;
  }

  isNegativeDpm(dpm: ApprovalDpmDto): boolean {
    return dpm.points < 0;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getShortType(type: string, maxLength = 18): string {
    // Simple truncation - no hardcoded mappings since types are editable
    if (type.length <= maxLength) {
      return type;
    }
    return type.substring(0, maxLength - 1).trim() + '…';
  }
}
