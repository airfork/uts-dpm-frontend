import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { DpmService } from '../../services/dpm.service';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { FormatService } from '../../services/format.service';
import PostDpmDto from '../../models/post-dpm-dto';
import UsernameDto from '../../models/username-dto';
import { first } from 'rxjs';
import { DPMGroup } from '../../models/dpm-type';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { DatePicker } from 'primeng/datepicker';
import { NgClass } from '@angular/common';
import { Ripple } from 'primeng/ripple';

type startEndTime = 'Start Time' | 'End Time';
const regex24HourTime = /^(?:[01][0-9]|2[0-3])[0-5][0-9](?::[0-5][0-9])?$/;

@Component({
  selector: 'app-new-dpm',
  templateUrl: './new-dpm.component.html',
  imports: [AutoComplete, ReactiveFormsModule, DatePicker, NgClass, Ripple],
})
export class NewDpmComponent implements OnInit, AfterViewInit {
  private driverNames: UsernameDto[] = [];

  homeFormGroup = new FormGroup({
    dpmDate: new FormControl(new Date(), [Validators.required]),
    startTime: new FormControl('', [
      Validators.required,
      Validators.maxLength(4),
      Validators.minLength(4),
      Validators.pattern(regex24HourTime),
    ]),
    endTime: new FormControl('', [
      Validators.required,
      Validators.maxLength(4),
      Validators.minLength(4),
      Validators.pattern(regex24HourTime),
    ]),
    name: new FormControl('', [Validators.required]),
    block: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    location: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    type: new FormControl(0),
    notes: new FormControl(''),
  });

  mobileMode = signal(false);
  autocompleteResults = signal<string[]>([]);
  dpmGroups = signal<DPMGroup[]>([]);
  isGroupsLoaded = signal<boolean>(false);

  constructor(
    private userService: UserService,
    private dpmService: DpmService,
    private notificationService: NotificationService,
    private formatService: FormatService
  ) {}

  ngOnInit() {
    const ua = navigator.userAgent;
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)
    ) {
      this.mobileMode.set(true);
    }

    this.userService
      .getUserNames()
      .pipe(first())
      .subscribe((users) => (this.driverNames = users));

    this.dpmService
      .getDpmGroups()
      .pipe(first())
      .subscribe((groups) => {
        this.dpmGroups.set(groups);
        this.isGroupsLoaded.set(true);
        this.setDefaultDpmType();
      });
  }

  ngAfterViewInit() {
    // additional check after view init in case the above wasn't enough
    setTimeout(() => {
      if (this.isGroupsLoaded() && !this.homeFormGroup.get('type')?.value) {
        this.setDefaultDpmType();
      }
    }, 0);
  }

  // New helper method to set the default DPM type
  private setDefaultDpmType() {
    const groups = this.dpmGroups();
    if (groups && groups.length > 0 && groups[0].dpms && groups[0].dpms.length > 0) {
      this.homeFormGroup.patchValue({
        type: groups[0].dpms[0].id,
      });

      // Force detection of the change
      setTimeout(() => {
        this.homeFormGroup.updateValueAndValidity();
      }, 0);
    } else {
      console.warn('No DPM groups or types found to set as default');
    }
  }

  search(event: AutoCompleteCompleteEvent) {
    this.autocompleteResults.set(
      this.driverNames
        .filter((user) => user.name.toLowerCase().includes(event.query.toLowerCase()))
        .map((user) => user.name)
    );
  }

  errorsOrSuccess(control: AbstractControl | null): string {
    return this.hasErrors(control) ? 'input-error' : 'input-success';
  }

  setStatusClass(control: AbstractControl | null, isInput = true): string {
    if (control == null) return '';
    const prefix = isInput ? 'input-' : 'text-';

    if (this.hasErrors(control)) return prefix + 'error';
    if (control.dirty || control.touched) return prefix + 'success';
    return '';
  }

  onSubmit() {
    this.dpmService
      .create(this.formGroupToDto())
      .pipe(first())
      .subscribe(() => {
        this.notificationService.showSuccess('DPM Created', 'Success');
        const groups = this.dpmGroups();
        this.homeFormGroup.reset({
          dpmDate: new Date(),
          type: groups[0].dpms[0].id,
        });
      });
  }

  getStartTimeValidationMessages(): string {
    if (!this.hasErrors(this.startTime)) return '';

    return this.getTimeValidationMessages(
      'Start Time',
      this.startTime?.errors,
      this.startTime?.value?.toString()
    );
  }

  getEndTimeValidationMessages(): string {
    if (!this.hasErrors(this.endTime)) return '';

    return this.getTimeValidationMessages(
      'End Time',
      this.endTime?.errors,
      this.endTime?.value?.toString()
    );
  }

  getDpmDateValidationMessages(): string {
    if (!this.hasErrors(this.dpmDate)) return '';

    if (this.dpmDate?.errors?.['required']) {
      return 'Date is required';
    }

    return '';
  }

  getNameValidationMessages(): string {
    if (!this.hasErrors(this.name)) return '';

    if (this.name?.errors?.['required']) {
      return 'Name is required';
    }

    return '';
  }

  getBlockValidationMessages(): string {
    if (!this.hasErrors(this.block)) return '';

    if (this.block?.errors?.['required']) {
      return 'Block is required';
    }

    if (this.block?.errors?.['maxlength']) {
      return 'Block cannot be longer than 5 characters';
    }

    return '';
  }

  getLocationValidationMessages(): string {
    if (!this.hasErrors(this.location)) return '';

    if (this.location?.errors?.['required']) {
      return 'Location is required';
    }

    if (this.location?.errors?.['maxlength']) {
      return 'Location cannot be longer than 5 characters';
    }

    return '';
  }

  hasErrors(control: AbstractControl | null): boolean {
    if (!control) return false;
    return control.invalid && (control.dirty || control.touched);
  }

  get dpmDate() {
    return this.homeFormGroup.get('dpmDate');
  }

  get startTime() {
    return this.homeFormGroup.get('startTime');
  }

  get endTime() {
    return this.homeFormGroup.get('endTime');
  }

  get name() {
    return this.homeFormGroup.get('name');
  }

  get block() {
    return this.homeFormGroup.get('block');
  }

  get location() {
    return this.homeFormGroup.get('location');
  }

  get format() {
    return this.formatService;
  }

  formatPoints(points: number): string {
    let strPoints: string;
    if (points > 0) {
      strPoints = `+${points}`;
    } else {
      strPoints = points.toString();
    }

    const pointLabel = Math.abs(points) > 1 ? 'Points' : 'Point';
    return `(${strPoints} ${pointLabel})`;
  }

  private getTimeValidationMessages(
    title: startEndTime,
    errors: ValidationErrors | null | undefined,
    value: string | undefined
  ): string {
    if (errors?.['required']) {
      return `${title} is required`;
    }

    if (errors?.['minlength'] || errors?.['maxlength']) {
      return `${title} must be 4 digits`;
    }

    if (errors?.['pattern']) {
      if (value) {
        return `'${value}' is not a valid time`;
      }
      return 'Invalid time';
    }

    return 'Unknown validation error';
  }

  private formGroupToDto(): PostDpmDto {
    const values = this.homeFormGroup.value;
    const dto: PostDpmDto = {
      driver: values.name!,
      block: values.block!,
      date: this.formatService.dpmDate(values.dpmDate!),
      type: values.type!,
      location: values.location!,
      startTime: values.startTime!,
      endTime: values.endTime!,
    };

    if (values.notes) {
      dto.notes = values.notes;
    }

    return dto;
  }
}
