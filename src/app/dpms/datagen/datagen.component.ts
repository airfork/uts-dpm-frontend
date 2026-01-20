import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  inject,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormatService } from '../../services/format.service';
import { environment } from '../../../environments/environment';
import { MixedDateValidator } from '../mixed-date.directive';
import { DatagenService } from '../../services/datagen.service';
import { NgClass } from '@angular/common';
import { DatePickerComponent } from '../../ui/date-picker/date-picker.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { PageHeaderComponent } from '../../ui/page-header/page-header.component';

@Component({
  selector: 'app-datagen',
  templateUrl: './datagen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    NgClass,
    DatePickerComponent,
    ButtonComponent,
    PageHeaderComponent,
  ],
})
export class DatagenComponent implements OnInit {
  private formatService = inject(FormatService);
  private datagenService = inject(DatagenService);

  @ViewChild('startDatePicker') startDatePicker!: DatePickerComponent;
  @ViewChild('endDatePicker') endDatePicker!: DatePickerComponent;

  private BASE_URL = environment.baseUrl + '/datagen';
  mobileMode = signal(false);
  selectedPreset = signal<string | null>('last30');
  loadingDpm = signal(false);
  loadingUser = signal(false);

  readonly datePresets = [
    { id: 'last30', label: 'Last 30 days' },
    { id: 'thisMonth', label: 'This month' },
    { id: 'lastMonth', label: 'Last month' },
  ] as const;

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

    // Set default to last 30 days
    this.applyPreset('last30');
  }

  applyPreset(presetId: string) {
    const today = new Date();
    let startDate: Date;
    let endDate: Date = today;

    switch (presetId) {
      case 'last30':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        return;
    }

    this.dpmDataFormGroup.patchValue({ startDate, endDate });
    this.selectedPreset.set(presetId);
  }

  onDateChange() {
    this.selectedPreset.set(null);
  }

  onStartDateOpen() {
    this.endDatePicker?.close();
  }

  onEndDateOpen() {
    this.startDatePicker?.close();
  }

  getUserData() {
    this.loadingUser.set(true);
    this.datagenService.downloadUserData();
    // Brief loading state for feedback, actual download is quick
    setTimeout(() => this.loadingUser.set(false), 500);
  }

  getDpmData() {
    this.loadingDpm.set(true);
    this.datagenService.downloadDpmData(this.generateDownloadUrl(), () => {
      this.loadingDpm.set(false);
      this.applyPreset('last30'); // Reset to default
    });
    // Fallback timeout in case callback doesn't fire
    setTimeout(() => this.loadingDpm.set(false), 3000);
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
