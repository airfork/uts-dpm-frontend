import { Component, LOCALE_ID, OnInit, signal, inject } from '@angular/core';
import { AutogenService } from '../../services/autogen.service';
import { formatDate } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { first } from 'rxjs';
import AutogenDpm from '../../models/autogen-dpm';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-autogen',
  templateUrl: './autogen.component.html',
  imports: [LoadingComponent, Ripple],
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
}
