import { Component } from '@angular/core';
import { ApprovalsService } from '../../services/approvals.service';
import { FormatService } from '../../services/format.service';
import { first } from 'rxjs';
import ApprovalDpmDto from '../../models/approval-dpm-dto';
import { NotificationService } from '../../services/notification.service';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss'],
  standalone: false,
})
export class ApprovalsComponent {
  private lastLazyLoadEvent?: TableLazyLoadEvent;

  dpms: ApprovalDpmDto[] = [];
  loadingDpms = true;
  totalRecords = 0;

  modalOpen = false;
  currentDpm?: ApprovalDpmDto;
  editOpen = false;
  currentPoints? = 0;

  constructor(
    private approvalsService: ApprovalsService,
    private formatService: FormatService,
    private notificationService: NotificationService
  ) {}

  showApprovalModal(dpm: ApprovalDpmDto) {
    this.currentDpm = dpm;
    this.modalOpen = true;
  }

  hideEdit() {
    this.editOpen = false;
    if (this.currentPoints) {
      this.currentDpm!.points = this.currentPoints;
      this.approvalsService
        .updatePoints(this.currentDpm!.id, this.currentPoints)
        .pipe(first())
        .subscribe();
    }
  }

  showEdit($event: MouseEvent) {
    $event.stopPropagation();
    this.currentPoints = this.currentDpm?.points;
    this.editOpen = true;
  }

  approveDpm() {
    if (!this.currentDpm) return;
    this.dpms = this.dpms?.filter((dto) => dto.id != this.currentDpm?.id);
    this.approvalsService
      .approveDpm(this.currentDpm?.id)
      .pipe(first())
      .subscribe(() => {
        this.notificationService.showSuccess('DPM has been approved', 'Success');
        this.lazyLoadEvent(this.lastLazyLoadEvent!);
      });
  }

  denyDpm() {
    if (!this.currentDpm) return;
    this.dpms = this.dpms?.filter((dto) => dto.id != this.currentDpm?.id);
    this.approvalsService
      .denyDpm(this.currentDpm.id)
      .pipe(first())
      .subscribe(() => {
        this.notificationService.showSuccess('DPM has been denied', 'Success');
        this.lazyLoadEvent(this.lastLazyLoadEvent!);
      });
  }

  lazyLoadEvent(event: TableLazyLoadEvent) {
    this.lastLazyLoadEvent = event;
    this.loadingDpms = true;
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
      .subscribe((page) => {
        this.dpms = page.content;
        this.totalRecords = page.totalElements;
        this.loadingDpms = false;
      });
  }

  get format() {
    return this.formatService;
  }
}
