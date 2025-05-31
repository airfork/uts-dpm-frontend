import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormatService } from '../../services/format.service';
import { environment } from '../../../environments/environment';
import { MixedDateValidator } from '../mixed-date.directive';
import { DatagenService } from '../../services/datagen.service';
import { NgClass } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-datagen',
  templateUrl: './datagen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgClass, Ripple, DatePicker],
})
export class DatagenComponent implements OnInit {
  private formatService = inject(FormatService);
  private datagenService = inject(DatagenService);

  private BASE_URL = environment.baseUrl + '/datagen';
  mobileMode = signal(false);

  dpmDataFormGroup = new FormGroup(
    {
      startDate: new FormControl<Date | null>(null),
      endDate: new FormControl(new Date()),
      getAll: new FormControl(false, { nonNullable: true }),
    },
    { validators: MixedDateValidator }
  );

  ngOnInit() {
    const ua = navigator.userAgent;
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)
    ) {
      this.mobileMode.set(true);
    }
  }

  getUserData() {
    this.datagenService.downloadUserData();
  }

  getDpmData() {
    this.datagenService.downloadDpmData(this.generateDownloadUrl(), () =>
      this.dpmDataFormGroup.reset({ endDate: new Date() })
    );
  }

  errorsOrEmpty(): string {
    if (this.dpmDataFormGroup.errors?.['mixedDate'] && !this.getAll?.value) {
      return 'input-error';
    }

    return '';
  }

  getStartTimeValidationMessages(): string {
    if (this.getAll?.value) return '';

    if (this.dpmDataFormGroup.errors?.['mixedDate']) {
      return 'Start date cannot be after end date';
    }

    return '';
  }

  getEndTimeValidationMessages(): string {
    if (this.getAll?.value) return '';

    if (this.dpmDataFormGroup.errors?.['mixedDate']) {
      return 'End date cannot be before start date';
    }

    return '';
  }

  generateDownloadUrl(): string {
    if (this.dpmDataFormGroup.invalid && !this.dpmDataFormGroup.value.getAll) return '#';

    const values = this.dpmDataFormGroup.value;

    if (values.getAll) {
      return `${this.BASE_URL}/dpms`;
    }

    let startDateParam = '';
    let endDateParam = '';

    if (values.startDate) {
      startDateParam = `?startDate=${this.format.datagenDate(values.startDate)}`;
    }

    if (values.endDate) {
      const prefix = values.startDate ? '&' : '?';
      endDateParam = `${prefix}endDate=${this.format.datagenDate(values.endDate)}`;
    }

    return `${this.BASE_URL}/dpms${startDateParam}${endDateParam}`;
  }

  get startDate() {
    return this.dpmDataFormGroup.get('startDate');
  }

  get endDate() {
    return this.dpmDataFormGroup.get('endDate');
  }

  get getAll() {
    return this.dpmDataFormGroup.get('getAll');
  }

  get format() {
    return this.formatService;
  }
}
