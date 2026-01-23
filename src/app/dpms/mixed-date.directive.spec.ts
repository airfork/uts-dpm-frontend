import { FormControl, FormGroup } from '@angular/forms';
import { MixedDateValidator } from './mixed-date.directive';

describe('MixedDateValidator', () => {
  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup(
      {
        startDate: new FormControl(null),
        endDate: new FormControl(null),
      },
      { validators: MixedDateValidator }
    );
  });

  it('should return null when both fields are empty', () => {
    expect(formGroup.errors).toBeNull();
  });

  it('should return null when only startDate is set', () => {
    formGroup.patchValue({ startDate: new Date(2025, 0, 1) });
    expect(formGroup.errors).toBeNull();
  });

  it('should return null when only endDate is set', () => {
    formGroup.patchValue({ endDate: new Date(2025, 0, 31) });
    expect(formGroup.errors).toBeNull();
  });

  it('should return null when startDate is before endDate', () => {
    formGroup.patchValue({
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 0, 31),
    });
    expect(formGroup.errors).toBeNull();
  });

  it('should return null when startDate equals endDate', () => {
    const date = new Date(2025, 0, 15);
    formGroup.patchValue({
      startDate: date,
      endDate: date,
    });
    expect(formGroup.errors).toBeNull();
  });

  it('should return error when startDate is after endDate', () => {
    formGroup.patchValue({
      startDate: new Date(2025, 0, 31),
      endDate: new Date(2025, 0, 1),
    });
    expect(formGroup.errors).toEqual({ mixedDate: true });
  });

  it('should return null after correcting date order', () => {
    formGroup.patchValue({
      startDate: new Date(2025, 0, 31),
      endDate: new Date(2025, 0, 1),
    });
    expect(formGroup.errors).toEqual({ mixedDate: true });

    formGroup.patchValue({ startDate: new Date(2024, 11, 1) });
    expect(formGroup.errors).toBeNull();
  });
});
