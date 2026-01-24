import { Component, LOCALE_ID, OnInit, signal, inject } from '@angular/core';
import { AutogenService } from '../../services/autogen.service';
import { formatDate } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { first } from 'rxjs';
import AutogenDpm from '../../models/autogen-dpm';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';
import { ButtonComponent } from '../../ui/button/button.component';
import { PageHeaderComponent } from '../../ui/page-header/page-header.component';
import {
  SkeletonComponent,
  TableSkeletonComponent,
  CardSkeletonComponent,
} from '../../ui/skeleton';

@Component({
  selector: 'app-autogen',
  templateUrl: './autogen.component.html',
  imports: [
    TooltipDirective,
    ButtonComponent,
    PageHeaderComponent,
    SkeletonComponent,
    TableSkeletonComponent,
    CardSkeletonComponent,
  ],
})
export class AutogenComponent implements OnInit {
  private autogenService = inject(AutogenService);
  private locale = inject(LOCALE_ID);
  private notificationService = inject(NotificationService);

  autogenDpms = signal<AutogenDpm[]>([]);
  loading = signal(true);
  submittedTime = signal<string | null>(null);
  empty = signal(false);

  ngOnInit() {
    this.autogenService
      .getAutogenDpms()
      .pipe(first())
      .subscribe(async (wrapper) => {
        if (wrapper.submitted) this.submittedTime.set(wrapper.submitted);
        if (wrapper.dpms.length === 0) this.empty.set(true);
        this.autogenDpms.set(wrapper.dpms);
        this.loading.set(false);
      });
  }

  onSubmit() {
    this.autogenService
      .submit()
      .pipe(first())
      .subscribe(() => {
        this.notificationService.showSuccess('Submitted DPMs!');
        this.submittedTime.set(formatDate(new Date(), 'HHmm', this.locale));
      });
  }

  getPositiveCount(): number {
    return this.autogenDpms().filter((dpm) => dpm.positive).length;
  }

  getNegativeCount(): number {
    return this.autogenDpms().filter((dpm) => !dpm.positive).length;
  }

  getStatusText(dpm: AutogenDpm, maxLength = 12): string {
    const type = dpm.type.toLowerCase();
    // Known types with friendly display names
    if (type.includes('dns') || type.includes('did not show')) {
      return 'No Show';
    }
    if (type.includes('picked up') || type.includes('pickup')) {
      return 'Picked Up';
    }
    // Fallback: use the actual type name, truncated if needed
    if (dpm.type.length <= maxLength) {
      return dpm.type;
    }
    return dpm.type.substring(0, maxLength - 1).trim() + '…';
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
