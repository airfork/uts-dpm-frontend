import { Component, ElementRef, signal, ViewChild, inject } from '@angular/core';
import { ApprovalsService } from '../../services/approvals.service';
import { FormatService } from '../../services/format.service';
import { first } from 'rxjs';
import ApprovalDpmDto from '../../models/approval-dpm-dto';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { UpperCasePipe } from '@angular/common';
import { BlockPipe } from '../../shared/pipes/BlockPipe';
import { PointsPipe } from '../../shared/pipes/PointsPipe';
import { ModalComponent } from '../../ui/modal/modal.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { DataTableComponent } from '../../ui/data-table/data-table.component';
import { TableColumn, LazyLoadEvent } from '../../ui/data-table/data-table.types';
import { PageHeaderComponent } from '../../ui/page-header/page-header.component';
import { EmptyStateComponent } from '../../ui/empty-state/empty-state.component';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css'],
  imports: [
    FormsModule,
    LoadingComponent,
    UpperCasePipe,
    BlockPipe,
    PointsPipe,
    ModalComponent,
    ButtonComponent,
    AvatarComponent,
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

  dpms = signal<ApprovalDpmDto[]>([]);
  loadingDpms = signal(true);
  totalRecords = signal(0);

  columns: TableColumn<ApprovalDpmDto>[] = [
    { field: 'driver', header: 'Driver' },
    { field: 'block', header: 'Block/Time' },
    { field: 'type', header: 'Type' },
  ];

  constructor() {
    // Trigger initial load
    this.lazyLoadEvent({ first: 0, rows: 10 });
  }

  currentDpm = signal<ApprovalDpmDto | null>(null);
  editOpen = signal(false);
  currentPoints = signal<number | undefined>(0);
  isModalOpen = signal(false);

  @ViewChild('pointsInput') pointsInput!: ElementRef;

  showApprovalModal(dpm: ApprovalDpmDto) {
    this.currentDpm.set(dpm);
    this.editOpen.set(false);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  hideEdit() {
    this.editOpen.set(false);
    const currentDpm = this.currentDpm();
    const currentPoints = this.currentPoints();
    if (!currentDpm || !currentPoints || currentPoints === currentDpm?.points) return;

    currentDpm.points = currentPoints;
    this.currentDpm.set(currentDpm);
    this.approvalsService
      .updatePoints(this.currentDpm()!.id, currentPoints)
      .pipe(first())
      .subscribe();
  }

  showEdit($event: MouseEvent) {
    $event.stopPropagation();
    this.currentPoints.set(this.currentDpm()?.points);
    this.editOpen.set(true);
    setTimeout(() => {
      this.pointsInput.nativeElement.focus();
    }, 0);
  }

  approveDpm() {
    const currentDpm = this.currentDpm();
    if (!currentDpm) return;

    this.closeModal();
    this.dpms.update((prev) => prev.filter((dto) => dto.id != this.currentDpm()?.id));
    this.approvalsService
      .approveDpm(currentDpm.id)
      .pipe(first())
      .subscribe(() => {
        this.notificationService.showSuccess('DPM has been approved');
        this.lazyLoadEvent(this.lastLazyLoadEvent!);
      });
  }

  denyDpm() {
    const currentDpm = this.currentDpm();
    if (!currentDpm) return;

    this.closeModal();
    this.dpms.update((prev) => prev.filter((dto) => dto.id != this.currentDpm()?.id));
    this.approvalsService
      .denyDpm(currentDpm.id)
      .pipe(first())
      .subscribe(() => {
        this.notificationService.showSuccess('DPM has been denied');
        this.lazyLoadEvent(this.lastLazyLoadEvent!);
      });
  }

  lazyLoadEvent(event: LazyLoadEvent) {
    this.lastLazyLoadEvent = event;
    this.loadingDpms.set(true);
    const size = event.rows;
    const page = event.first / size;

    this.approvalsService
      .getApprovalDpms(page, size)
      .pipe(first())
      .subscribe(async (pageData) => {
        this.dpms.set(pageData.content);
        this.totalRecords.set(pageData.totalElements);
        this.loadingDpms.set(false);
      });
  }

  get format() {
    return this.formatService;
  }
}
