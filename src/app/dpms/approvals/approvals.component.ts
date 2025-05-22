import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { ApprovalsService } from '../../services/approvals.service';
import { FormatService } from '../../services/format.service';
import { first } from 'rxjs';
import ApprovalDpmDto from '../../models/approval-dpm-dto';
import { NotificationService } from '../../services/notification.service';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { UpperCasePipe } from '@angular/common';
import { BlockPipe } from '../../shared/pipes/BlockPipe';
import { PointsPipe } from '../../shared/pipes/PointsPipe';
import { Ripple } from 'primeng/ripple';
import { PrimeTemplate } from 'primeng/api';

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
    Ripple,
    PrimeTemplate,
    TableModule,
    PointsPipe,
  ],
})
export class ApprovalsComponent {
  private lastLazyLoadEvent?: TableLazyLoadEvent;

  dpms = signal<ApprovalDpmDto[]>([]);
  loadingDpms = signal(true);
  totalRecords = signal(0);

  currentDpm = signal<ApprovalDpmDto | null>(null);
  editOpen = signal(false);
  currentPoints = signal<number | undefined>(0);

  @ViewChild('dpmModal') dpmModalElement!: ElementRef<HTMLDialogElement>;

  constructor(
    private approvalsService: ApprovalsService,
    private formatService: FormatService,
    private notificationService: NotificationService
  ) {}

  showApprovalModal(dpm: ApprovalDpmDto) {
    this.currentDpm.set(dpm);
    this.showModalInternal();
  }

  hideEdit() {
    this.editOpen.set(false);
    const currentDpm = this.currentDpm();
    const currentPoints = this.currentPoints();
    if (!currentDpm || !currentPoints) return;

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
  }

  approveDpm() {
    const currentDpm = this.currentDpm();
    if (!currentDpm) return;

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

    this.dpms.update((prev) => prev.filter((dto) => dto.id != this.currentDpm()?.id));
    this.approvalsService
      .denyDpm(currentDpm.id)
      .pipe(first())
      .subscribe(() => {
        this.notificationService.showSuccess('DPM has been denied');
        this.lazyLoadEvent(this.lastLazyLoadEvent!);
      });
  }

  lazyLoadEvent(event: TableLazyLoadEvent) {
    this.lastLazyLoadEvent = event;
    this.loadingDpms.set(true);
    let size = 10;
    if (event.rows) {
      size = event.rows;
    }

    let page = 0;
    if (event.first) {
      page = event.first / size;
    }

    this.approvalsService
      .getApprovalDpms(page, size)
      .pipe(first())
      .subscribe(async (page) => {
        this.dpms.set(page.content);
        this.totalRecords.set(page.totalElements);
        this.loadingDpms.set(false);
      });
  }

  get format() {
    return this.formatService;
  }

  showModalInternal() {
    if (this.dpmModalElement && this.dpmModalElement.nativeElement) {
      this.dpmModalElement.nativeElement.showModal();
    }
  }

  closeModalInternal() {
    if (this.dpmModalElement && this.dpmModalElement.nativeElement) {
      this.dpmModalElement.nativeElement.close();
    }
  }
}
