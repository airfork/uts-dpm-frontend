import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePickerComponent } from './date-picker.component';
import { format, addMonths, subMonths } from 'date-fns';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    it('should have default placeholder', () => {
      expect(component.placeholder()).toBe('Select date');
    });

    it('should have default dateFormat', () => {
      expect(component.dateFormat()).toBe('MM/dd/yyyy');
    });

    it('should have empty inputClass by default', () => {
      expect(component.inputClass()).toBe('');
    });

    it('should have empty inputId by default', () => {
      expect(component.inputId()).toBe('');
    });

    it('should have null minDate by default', () => {
      expect(component.minDate()).toBeNull();
    });

    it('should have null maxDate by default', () => {
      expect(component.maxDate()).toBeNull();
    });

    it('should be closed by default', () => {
      expect(component.isOpen()).toBe(false);
    });

    it('should have no selected date by default', () => {
      expect(component.selectedDate()).toBeNull();
    });
  });

  describe('calendarDays computed', () => {
    it('should generate calendar days', () => {
      const days = component.calendarDays();
      expect(days.length).toBeGreaterThan(28);
      expect(days.length).toBeLessThanOrEqual(42);
    });

    it('should mark today correctly', () => {
      const days = component.calendarDays();
      const today = days.find((d) => d.isToday);
      expect(today).toBeDefined();
    });

    it('should mark selected date correctly', () => {
      // Use today's month to ensure the date is in the current view
      const today = new Date();
      const date = new Date(today.getFullYear(), today.getMonth(), 15);
      component.viewDate.set(date);
      component.selectedDate.set(date);
      fixture.detectChanges();

      const days = component.calendarDays();
      const selected = days.find((d) => d.isSelected);
      expect(selected).toBeDefined();
    });
  });

  describe('ControlValueAccessor', () => {
    it('should write date value', () => {
      const date = new Date(2025, 5, 15);
      component.writeValue(date);
      expect(component.selectedDate()).toEqual(date);
      expect(component.inputValue()).toBe(format(date, 'MM/dd/yyyy'));
    });

    it('should write string date value', () => {
      const dateStr = '2025-06-15';
      component.writeValue(dateStr);
      expect(component.selectedDate()).toBeDefined();
    });

    it('should handle null value', () => {
      component.writeValue(null);
      expect(component.selectedDate()).toBeNull();
      expect(component.inputValue()).toBe('');
    });

    it('should register onChange callback', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      const date = new Date();
      component.selectDate(date);
      expect(fn).toHaveBeenCalledWith(date);
    });

    it('should register onTouched callback', () => {
      const fn = jasmine.createSpy('onTouched');
      component.registerOnTouched(fn);
      component.onInputBlur();
      expect(fn).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      expect(component.disabled).toBe(false);
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
    });
  });

  describe('toggleCalendar', () => {
    it('should open calendar when closed', () => {
      spyOn(component.opened, 'emit');
      component.toggleCalendar();
      expect(component.isOpen()).toBe(true);
      expect(component.opened.emit).toHaveBeenCalled();
    });

    it('should close calendar when open', () => {
      component.isOpen.set(true);
      spyOn(component.closed, 'emit');
      component.toggleCalendar();
      expect(component.isOpen()).toBe(false);
      expect(component.closed.emit).toHaveBeenCalled();
    });

    it('should not toggle when disabled', () => {
      component.disabled = true;
      component.toggleCalendar();
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('close', () => {
    it('should close the calendar', () => {
      component.isOpen.set(true);
      spyOn(component.closed, 'emit');
      component.close();
      expect(component.isOpen()).toBe(false);
      expect(component.closed.emit).toHaveBeenCalled();
    });

    it('should not emit if already closed', () => {
      spyOn(component.closed, 'emit');
      component.close();
      expect(component.closed.emit).not.toHaveBeenCalled();
    });
  });

  describe('selectDate', () => {
    it('should select a date', () => {
      const date = new Date(2025, 5, 15);
      component.selectDate(date);
      expect(component.selectedDate()).toEqual(date);
      expect(component.inputValue()).toBe('06/15/2025');
      expect(component.isOpen()).toBe(false);
    });

    it('should not select date before minDate', () => {
      const minDate = new Date(2025, 5, 10);
      fixture.componentRef.setInput('minDate', minDate);
      fixture.detectChanges();

      const date = new Date(2025, 5, 5);
      component.selectDate(date);
      expect(component.selectedDate()).toBeNull();
    });

    it('should not select date after maxDate', () => {
      const maxDate = new Date(2025, 5, 20);
      fixture.componentRef.setInput('maxDate', maxDate);
      fixture.detectChanges();

      const date = new Date(2025, 5, 25);
      component.selectDate(date);
      expect(component.selectedDate()).toBeNull();
    });
  });

  describe('selectToday', () => {
    it('should select today', () => {
      component.selectToday();
      const today = new Date();
      const selected = component.selectedDate();
      expect(selected?.getDate()).toBe(today.getDate());
      expect(selected?.getMonth()).toBe(today.getMonth());
      expect(selected?.getFullYear()).toBe(today.getFullYear());
    });
  });

  describe('navigation', () => {
    it('should go to previous month', () => {
      const initialMonth = component.viewDate().getMonth();
      component.prevMonth();
      const expected = subMonths(new Date(component.viewDate().getFullYear(), initialMonth, 1), 1);
      expect(component.viewDate().getMonth()).toBe(expected.getMonth());
    });

    it('should go to next month', () => {
      const initialMonth = component.viewDate().getMonth();
      component.nextMonth();
      const expected = addMonths(new Date(component.viewDate().getFullYear(), initialMonth, 1), 1);
      expect(component.viewDate().getMonth()).toBe(expected.getMonth());
    });
  });

  describe('year picker', () => {
    it('should toggle year picker', () => {
      expect(component.showYearPicker()).toBe(false);
      component.toggleYearPicker();
      expect(component.showYearPicker()).toBe(true);
      component.toggleYearPicker();
      expect(component.showYearPicker()).toBe(false);
    });

    it('should select year', () => {
      component.selectYear(2030);
      expect(component.viewDate().getFullYear()).toBe(2030);
      expect(component.showYearPicker()).toBe(false);
    });
  });

  describe('month selection', () => {
    it('should select month', () => {
      component.selectMonth(5);
      expect(component.viewDate().getMonth()).toBe(5);
    });
  });

  describe('isDateDisabled', () => {
    it('should return true for date before minDate', () => {
      const minDate = new Date(2025, 5, 10);
      fixture.componentRef.setInput('minDate', minDate);
      fixture.detectChanges();

      expect(component.isDateDisabled(new Date(2025, 5, 5))).toBe(true);
    });

    it('should return true for date after maxDate', () => {
      const maxDate = new Date(2025, 5, 20);
      fixture.componentRef.setInput('maxDate', maxDate);
      fixture.detectChanges();

      expect(component.isDateDisabled(new Date(2025, 5, 25))).toBe(true);
    });

    it('should return false for valid date', () => {
      expect(component.isDateDisabled(new Date())).toBe(false);
    });
  });

  describe('computed properties', () => {
    it('should return current month name', () => {
      expect(component.currentMonth()).toBe(format(component.viewDate(), 'MMMM'));
    });

    it('should return current year', () => {
      expect(component.currentYear()).toBe(format(component.viewDate(), 'yyyy'));
    });

    it('should return years array', () => {
      const years = component.years();
      expect(years.length).toBe(61);
      expect(years).toContain(new Date().getFullYear());
    });
  });

  describe('onInputChange', () => {
    it('should parse valid date input', () => {
      const event = { target: { value: '06/15/2025' } } as unknown as Event;
      component.onInputChange(event);
      expect(component.selectedDate()?.getMonth()).toBe(5);
      expect(component.selectedDate()?.getDate()).toBe(15);
    });

    it('should handle empty input', () => {
      component.selectDate(new Date());
      const event = { target: { value: '' } } as unknown as Event;
      component.onInputChange(event);
      expect(component.selectedDate()).toBeNull();
    });
  });

  describe('keyboard handling', () => {
    it('should close on Escape key', () => {
      component.isOpen.set(true);
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeyDown(event);
      expect(component.isOpen()).toBe(false);
    });
  });
});
