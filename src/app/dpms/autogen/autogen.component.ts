import { Component, Inject, LOCALE_ID, OnInit, signal } from '@angular/core';
import { AutogenService } from '../../services/autogen.service';
import { formatDate } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { first } from 'rxjs';
import AutogenDpm from '../../models/autogen-dpm';

@Component({
  selector: 'app-autogen',
  templateUrl: './autogen.component.html',
  standalone: false,
})
export class AutogenComponent implements OnInit {
  autogenDpms = signal<AutogenDpm[]>([]);
  loading = signal(true);
  submittedTime = signal<string | null>(null);
  empty = signal(false);

  constructor(
    private autogenService: AutogenService,
    @Inject(LOCALE_ID) private locale: string,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.autogenService
      .getAutogenDpms()
      .pipe(first())
      .subscribe((wrapper) => {
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
