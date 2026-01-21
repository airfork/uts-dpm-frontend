import { FormControl, FormGroup } from '@angular/forms';
import { PasswordsNotEqualValidator } from './passwords-not-equal.directive';

describe('PasswordsNotEqualValidator', () => {
  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup(
      {
        currentPassword: new FormControl(''),
        newPassword: new FormControl(''),
      },
      { validators: PasswordsNotEqualValidator }
    );
  });

  it('should return null when both fields are empty', () => {
    expect(formGroup.errors).toBeNull();
  });

  it('should return null when only currentPassword is set', () => {
    formGroup.patchValue({ currentPassword: 'oldpassword' });
    expect(formGroup.errors).toBeNull();
  });

  it('should return null when only newPassword is set', () => {
    formGroup.patchValue({ newPassword: 'newpassword123' });
    expect(formGroup.errors).toBeNull();
  });

  it('should return null when newPassword is less than 8 characters', () => {
    formGroup.patchValue({ currentPassword: 'same', newPassword: 'same' });
    expect(formGroup.errors).toBeNull();
  });

  it('should return null when passwords are different', () => {
    formGroup.patchValue({
      currentPassword: 'oldpassword',
      newPassword: 'newpassword123',
    });
    expect(formGroup.errors).toBeNull();
  });

  it('should return error when passwords are the same', () => {
    formGroup.patchValue({
      currentPassword: 'samepassword123',
      newPassword: 'samepassword123',
    });
    expect(formGroup.errors).toEqual({ passwordsNotEqual: true });
  });

  it('should return null after changing password to different value', () => {
    formGroup.patchValue({
      currentPassword: 'samepassword123',
      newPassword: 'samepassword123',
    });
    expect(formGroup.errors).toEqual({ passwordsNotEqual: true });

    formGroup.patchValue({ newPassword: 'different123' });
    expect(formGroup.errors).toBeNull();
  });
});
