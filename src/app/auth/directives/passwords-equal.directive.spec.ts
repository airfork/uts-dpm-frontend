import { FormControl, FormGroup } from '@angular/forms';
import { PasswordsEqualValidator } from './passwords-equal.directive';

describe('PasswordsEqualValidator', () => {
  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup(
      {
        newPassword: new FormControl(''),
        confirmPassword: new FormControl(''),
      },
      { validators: PasswordsEqualValidator }
    );
  });

  it('should return null when both fields are empty', () => {
    expect(formGroup.errors).toBeNull();
  });

  it('should return null when only newPassword is set', () => {
    formGroup.patchValue({ newPassword: 'password123' });
    expect(formGroup.errors).toBeNull();
  });

  it('should return null when only confirmPassword is set', () => {
    formGroup.patchValue({ confirmPassword: 'password123' });
    expect(formGroup.errors).toBeNull();
  });

  it('should return null when newPassword is less than 8 characters', () => {
    formGroup.patchValue({
      newPassword: 'short',
      confirmPassword: 'different',
    });
    expect(formGroup.errors).toBeNull();
  });

  it('should return null when passwords match', () => {
    formGroup.patchValue({
      newPassword: 'password123',
      confirmPassword: 'password123',
    });
    expect(formGroup.errors).toBeNull();
  });

  it('should return error when passwords do not match', () => {
    formGroup.patchValue({
      newPassword: 'password123',
      confirmPassword: 'password456',
    });
    expect(formGroup.errors).toEqual({ passwordsEqual: true });
  });

  it('should return error when passwords are similar but different', () => {
    formGroup.patchValue({
      newPassword: 'password123',
      confirmPassword: 'password12',
    });
    expect(formGroup.errors).toEqual({ passwordsEqual: true });
  });

  it('should return null after correcting password mismatch', () => {
    formGroup.patchValue({
      newPassword: 'password123',
      confirmPassword: 'password456',
    });
    expect(formGroup.errors).toEqual({ passwordsEqual: true });

    formGroup.patchValue({ confirmPassword: 'password123' });
    expect(formGroup.errors).toBeNull();
  });
});
