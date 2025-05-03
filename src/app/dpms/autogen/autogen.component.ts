import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
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
  autogenDpms?: AutogenDpm[];
  submittedTime?: string;
  empty = false;

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
        if (wrapper.submitted) this.submittedTime = wrapper.submitted;
        if (wrapper.dpms.length === 0) this.empty = true;
        this.autogenDpms = wrapper.dpms;
      });
  }

  onSubmit() {
    this.autogenService
      .submit()
      .pipe(first())
      .subscribe(() => {
        this.notificationService.showSuccess('Submitted DPMs!');
        this.submittedTime = formatDate(new Date(), 'HHmm', this.locale);
      });
  }
}
