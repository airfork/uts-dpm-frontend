import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { ToastrService } from 'ngx-toastr';

describe('NotificationService', () => {
  let service: NotificationService;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning']);

    TestBed.configureTestingModule({
      providers: [NotificationService, { provide: ToastrService, useValue: toastrSpy }],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showSuccess', () => {
    it('should call toastr.success with message and title', () => {
      service.showSuccess('Operation successful', 'Success');

      expect(toastrSpy.success).toHaveBeenCalledWith('Operation successful', 'Success');
    });

    it('should call toastr.success with empty title by default', () => {
      service.showSuccess('Operation successful');

      expect(toastrSpy.success).toHaveBeenCalledWith('Operation successful', '');
    });

    it('should handle empty message', () => {
      service.showSuccess('', 'Title');

      expect(toastrSpy.success).toHaveBeenCalledWith('', 'Title');
    });
  });

  describe('showError', () => {
    it('should call toastr.error with message and title', () => {
      service.showError('Something went wrong', 'Error');

      expect(toastrSpy.error).toHaveBeenCalledWith('Something went wrong', 'Error');
    });

    it('should call toastr.error with empty title by default', () => {
      service.showError('Something went wrong');

      expect(toastrSpy.error).toHaveBeenCalledWith('Something went wrong', '');
    });

    it('should handle long error messages', () => {
      const longMessage =
        'This is a very long error message that might occur when there are validation errors or multiple issues that need to be displayed to the user.';
      service.showError(longMessage, 'Validation Error');

      expect(toastrSpy.error).toHaveBeenCalledWith(longMessage, 'Validation Error');
    });
  });

  describe('showInfo', () => {
    it('should call toastr.info with message and title', () => {
      service.showInfo('Please note this information', 'Info');

      expect(toastrSpy.info).toHaveBeenCalledWith('Please note this information', 'Info');
    });

    it('should call toastr.info with empty title by default', () => {
      service.showInfo('Information message');

      expect(toastrSpy.info).toHaveBeenCalledWith('Information message', '');
    });
  });

  describe('showWarning', () => {
    it('should call toastr.warning with message and title', () => {
      service.showWarning('Please be careful', 'Warning');

      expect(toastrSpy.warning).toHaveBeenCalledWith('Please be careful', 'Warning');
    });

    it('should call toastr.warning with empty title by default', () => {
      service.showWarning('Warning message');

      expect(toastrSpy.warning).toHaveBeenCalledWith('Warning message', '');
    });

    it('should be called for password change required', () => {
      service.showWarning('Password change required');

      expect(toastrSpy.warning).toHaveBeenCalledWith('Password change required', '');
    });
  });

  describe('multiple notifications', () => {
    it('should allow multiple notifications of different types', () => {
      service.showSuccess('Success message', 'Success');
      service.showError('Error message', 'Error');
      service.showInfo('Info message', 'Info');
      service.showWarning('Warning message', 'Warning');

      expect(toastrSpy.success).toHaveBeenCalledTimes(1);
      expect(toastrSpy.error).toHaveBeenCalledTimes(1);
      expect(toastrSpy.info).toHaveBeenCalledTimes(1);
      expect(toastrSpy.warning).toHaveBeenCalledTimes(1);
    });

    it('should allow multiple notifications of the same type', () => {
      service.showError('Error 1', 'Error');
      service.showError('Error 2', 'Error');
      service.showError('Error 3', 'Error');

      expect(toastrSpy.error).toHaveBeenCalledTimes(3);
    });
  });
});
