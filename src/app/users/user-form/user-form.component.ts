import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import GetUserDetailDto from '../../models/get-user-detail-dto';
import UserDetailDto from '../../models/user-detail-dto';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import Required from '../../shared/required-decorator';
import { first } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import CreateUserDto from '../../models/create-user-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import UsernameDto from '../../models/username-dto';

const POINTS_VALIDATORS = [Validators.required, Validators.pattern(/-?\d+/)];

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, FormsModule, ReactiveFormsModule, ButtonComponent],
})
export class UserFormComponent implements OnInit, OnChanges {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private changeDetector = inject(ChangeDetectorRef);

  @Input() @Required layout: 'create' | 'edit' = 'edit';
  @Input() managers: UsernameDto[] | null | undefined = undefined;
  @Input() userInfo?: { user: GetUserDetailDto; id: string };
  user = signal<GetUserDetailDto | null>(null);
  userId = signal<string | null>(null);
  waiting = signal(false);
  roles = signal<string[]>([]);

  // Store original values for change detection
  private originalValues: Record<string, unknown> | null = null;

  userFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    points: new FormControl(0, POINTS_VALIDATORS),
    managerId: new FormControl<number | null>(null, [Validators.required]),
    role: new FormControl(''),
    fullTime: new FormControl(false, { nonNullable: true }),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['managers'] && this.layout === 'create') {
      this.managers = changes['managers'].currentValue;
      this.setCreateFormData();
    }
  }

  ngOnInit() {
    if (this.layout === 'create') {
      this.initCreateLayout();
    } else {
      this.initEditLayout();
    }
  }

  onSubmit() {
    if (this.layout == 'edit') {
      this.editUser();
    } else {
      this.createUser();
    }
  }

  isButtonDisabled(): boolean {
    if (this.layout === 'edit') {
      return !this.userFormGroup.valid || !this.hasFormChanged();
    }

    return !this.userFormGroup.valid;
  }

  hasErrors(control: AbstractControl | null): boolean {
    if (!control) return false;
    return control.invalid && (control.dirty || control.touched);
  }

  hasFormChanged(): boolean {
    if (!this.originalValues) return false;
    // Use getRawValue() to include disabled form controls (like role when viewing own profile)
    const currentValues = this.userFormGroup.getRawValue();
    return Object.keys(this.originalValues).some(
      (key) => this.originalValues![key] !== currentValues[key as keyof typeof currentValues]
    );
  }

  hasFieldChanged(controlName: string): boolean {
    if (!this.originalValues || this.layout !== 'edit') return false;
    const currentValue = this.userFormGroup.get(controlName)?.value;
    return this.originalValues[controlName] !== currentValue;
  }

  resetForm(): void {
    if (this.layout === 'edit' && this.originalValues) {
      this.userFormGroup.reset(this.originalValues);
      this.userFormGroup.markAsPristine();
      this.userFormGroup.markAsUntouched();
    }
  }

  getInputBorderClass(control: AbstractControl | null, controlName?: string): string {
    if (control == null) {
      return 'border-neutral-200 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500/20';
    }

    if (this.hasErrors(control)) {
      return 'border-error-500 focus:border-error-500 focus:ring-error-500/20';
    }
    // Show success state only if control is valid AND value has actually changed from original
    if (control.valid && controlName && this.hasFieldChanged(controlName)) {
      return 'border-success-500 focus:border-success-500 focus:ring-success-500/20';
    }
    return 'border-neutral-200 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500/20';
  }

  getEmailValidationMessages(): string {
    if (!this.hasErrors(this.email)) return '';

    if (this.email?.errors?.['required']) {
      return 'Email is required';
    }

    if (this.email?.errors?.['email']) {
      return 'Input is not a valid email address';
    }

    return '';
  }

  getFirstnameValidationMessages(): string {
    if (!this.hasErrors(this.firstname)) return '';

    if (this.firstname?.errors?.['required']) {
      return 'First name is required';
    }

    return '';
  }

  getLastnameValidationMessages(): string {
    if (!this.hasErrors(this.lastname)) return '';

    if (this.lastname?.errors?.['required']) {
      return 'Last name is required';
    }

    return '';
  }

  getPointsValidationMessages(): string {
    if (!this.hasErrors(this.points)) return '';

    if (this.points?.errors?.['required']) {
      return 'Points is required';
    }

    if (this.points?.errors?.['pattern']) {
      return 'Points must be a valid number';
    }

    return '';
  }

  get email() {
    return this.userFormGroup.get('email');
  }

  get firstname() {
    return this.userFormGroup.get('firstname');
  }

  get lastname() {
    return this.userFormGroup.get('lastname');
  }

  get points() {
    return this.userFormGroup.get('points');
  }

  private setEditFormData() {
    const user = this.user();
    if (!user) return;

    const initialValues = {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      points: user.points,
      managerId: this.managers?.[0]?.id ?? user.managerId,
      role: this.roles()[0],
      fullTime: user.fullTime,
    };

    this.userFormGroup.reset(initialValues);
    this.originalValues = { ...initialValues };
  }

  private setCreateFormData() {
    if (this.managers?.length) {
      this.userFormGroup.reset({
        managerId: this.managers[0].id,
        role: this.roles()[0],
        fullTime: false,
      });
    } else {
      this.userFormGroup.reset({
        role: this.roles()[0],
        fullTime: false,
      });
    }
    this.points?.removeValidators(POINTS_VALIDATORS);
  }

  private formGroupToUserDetailDto(): UserDetailDto {
    const values = this.userFormGroup.value;
    return {
      email: values.email!,
      firstname: values.firstname!,
      lastname: values.lastname!,
      points: values.points!,
      managerId: values.managerId!,
      manager: this.managerNameById(values.managerId!),
      role: values.role!,
      fullTime: values.fullTime!,
    };
  }

  private formGroupToCreateUserDto(): CreateUserDto {
    const values = this.userFormGroup.value;
    return {
      email: values.email!,
      firstname: values.firstname!,
      lastname: values.lastname!,
      managerId: values.managerId!,
      manager: this.managerNameById(values.managerId!),
      role: values.role!,
      fullTime: values.fullTime!,
    };
  }

  private initCreateLayout() {
    this.roles.set(this.userService.orderRoles('Driver'));
    this.setCreateFormData();
    this.changeDetector.detectChanges();
  }

  private initEditLayout() {
    if (!this.userInfo) {
      console.error('User and id must be passed in if using the edit layout');
      return;
    }

    const user = this.userInfo.user;
    this.user.set(user);
    this.userId.set(this.userInfo.id);
    this.roles.set(this.userService.orderRoles(user.role));
    this.managers = this.userService.orderManagers(user.managerId, user.managers);

    if (
      this.authService.userData.username.toLowerCase().trim() === user.email.toLowerCase().trim()
    ) {
      this.userFormGroup.get('role')!.disable();
    }

    this.setEditFormData();
  }

  private editUser() {
    const userId = this.userId();
    const user = this.user();
    if (!userId || !user) return;
    this.waiting.set(true);

    this.userService
      .updateUser(this.formGroupToUserDetailDto(), userId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.waiting.set(false);
          this.notificationService.showSuccess('User updated');

          const newValues = { ...this.userFormGroup.value };
          if (!user.fullTime && newValues.fullTime!) {
            newValues.points = 0;
          }
          // role is not set if the formControl is disabled
          // role formControl is disabled if user is viewing themselves
          if (!newValues.role) {
            newValues.role = this.roles()[0];
          }

          this.userFormGroup.reset({ ...newValues });
          this.userFormGroup.markAsPristine();
          // Update original values so the form knows the new baseline
          this.originalValues = { ...newValues };
        },
        error: () => {
          this.waiting.set(false);
        },
      });
  }

  private createUser() {
    this.userService
      .createUser(this.formGroupToCreateUserDto())
      .pipe(first())
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('User created');
          this.userFormGroup.reset({
            managerId: this.managers?.[0]?.id ?? null,
            role: this.roles()[0],
            fullTime: false,
          });
          this.changeDetector.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 422) {
            this.notificationService.showError(
              'A user with this email/username already exists',
              'Error'
            );
            const values = this.userFormGroup.value;
            this.userFormGroup.reset({ ...values, email: '' });
            this.firstname?.markAsTouched();
            this.lastname?.markAsTouched();
            this.changeDetector.detectChanges();
          } else {
            this.notificationService.showError('Something went wrong, please try again', 'Error');
            console.error('Something went wrong trying to create the user', error);
          }
        },
      });
  }

  private managerNameById(managerId: number): string {
    return this.managers?.find((manager) => manager.id === managerId)?.name ?? '';
  }
}
