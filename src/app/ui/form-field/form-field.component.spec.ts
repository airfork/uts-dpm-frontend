import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field.component';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'test-field');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should have id input', () => {
      expect(component.id()).toBe('test-field');
    });

    it('should have empty label by default', () => {
      expect(component.label()).toBe('');
    });

    it('should have empty hint by default', () => {
      expect(component.hint()).toBe('');
    });

    it('should have required as false by default', () => {
      expect(component.required()).toBe(false);
    });

    it('should have text type by default', () => {
      expect(component.type()).toBe('text');
    });

    it('should have empty placeholder by default', () => {
      expect(component.placeholder()).toBe('');
    });

    it('should accept label input', () => {
      fixture.componentRef.setInput('label', 'Email');
      fixture.detectChanges();
      expect(component.label()).toBe('Email');
    });

    it('should accept hint input', () => {
      fixture.componentRef.setInput('hint', 'Enter your email');
      fixture.detectChanges();
      expect(component.hint()).toBe('Enter your email');
    });

    it('should accept required input', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      expect(component.required()).toBe(true);
    });

    it('should accept type input', () => {
      fixture.componentRef.setInput('type', 'password');
      fixture.detectChanges();
      expect(component.type()).toBe('password');
    });

    it('should accept placeholder input', () => {
      fixture.componentRef.setInput('placeholder', 'Enter value');
      fixture.detectChanges();
      expect(component.placeholder()).toBe('Enter value');
    });
  });

  describe('internal state', () => {
    it('should have empty value by default', () => {
      expect(component.value()).toBe('');
    });

    it('should have disabled as false by default', () => {
      expect(component.disabled()).toBe(false);
    });

    it('should have touched as false by default', () => {
      expect(component.touched()).toBe(false);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue('test value');
      expect(component.value()).toBe('test value');
    });

    it('should handle null value', () => {
      component.writeValue(null);
      expect(component.value()).toBe('');
    });

    it('should handle undefined value', () => {
      component.writeValue(undefined);
      expect(component.value()).toBe('');
    });

    it('should register onChange callback', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      component.onChange('test');
      expect(fn).toHaveBeenCalledWith('test');
    });

    it('should register onTouched callback', () => {
      const fn = jasmine.createSpy('onTouched');
      component.registerOnTouched(fn);
      component.onTouched();
      expect(fn).toHaveBeenCalled();
    });

    it('should set disabled state to true', () => {
      expect(component.disabled()).toBe(false);
      component.setDisabledState(true);
      expect(component.disabled()).toBe(true);
    });

    it('should set disabled state to false', () => {
      component.setDisabledState(true);
      component.setDisabledState(false);
      expect(component.disabled()).toBe(false);
    });
  });

  describe('onInput', () => {
    it('should update value and call onChange', () => {
      const onChangeSpy = jasmine.createSpy('onChange');
      component.registerOnChange(onChangeSpy);

      const event = { target: { value: 'new value' } } as unknown as Event;
      component.onInput(event);

      expect(component.value()).toBe('new value');
      expect(onChangeSpy).toHaveBeenCalledWith('new value');
    });

    it('should handle empty input', () => {
      const onChangeSpy = jasmine.createSpy('onChange');
      component.registerOnChange(onChangeSpy);

      const event = { target: { value: '' } } as unknown as Event;
      component.onInput(event);

      expect(component.value()).toBe('');
      expect(onChangeSpy).toHaveBeenCalledWith('');
    });
  });

  describe('onBlur', () => {
    it('should set touched to true', () => {
      expect(component.touched()).toBe(false);
      component.onBlur();
      expect(component.touched()).toBe(true);
    });

    it('should call onTouched callback', () => {
      const onTouchedSpy = jasmine.createSpy('onTouched');
      component.registerOnTouched(onTouchedSpy);
      component.onBlur();
      expect(onTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('hasError computed', () => {
    it('should return falsy when ngControl is not set', () => {
      expect(component.hasError()).toBeFalsy();
    });
  });

  describe('errorMessage computed', () => {
    it('should return empty string when hasError is false', () => {
      expect(component.errorMessage()).toBe('');
    });
  });
});
