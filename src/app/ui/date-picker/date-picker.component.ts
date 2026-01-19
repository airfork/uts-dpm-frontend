import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  input,
  signal,
  computed,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  format,
  parse,
  isValid,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  isToday,
  setYear,
  setMonth,
} from 'date-fns';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  standalone: true,
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor {
  // Inputs
  placeholder = input<string>('Select date');
  dateFormat = input<string>('MM/dd/yyyy');
  inputClass = input<string>('');
  inputId = input<string>('');
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);

  // Internal state
  isOpen = signal(false);
  viewDate = signal(new Date());
  selectedDate = signal<Date | null>(null);
  inputValue = signal('');
  showYearPicker = signal(false);

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  // ControlValueAccessor
  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};
  disabled = false;

  // Computed values
  currentMonth = computed(() => format(this.viewDate(), 'MMMM'));
  currentYear = computed(() => format(this.viewDate(), 'yyyy'));

  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  calendarDays = computed(() => {
    const view = this.viewDate();
    const selected = this.selectedDate();
    const monthStart = startOfMonth(view);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days: CalendarDay[] = [];
    let day = startDate;

    while (day <= endDate) {
      days.push({
        date: day,
        isCurrentMonth: isSameMonth(day, monthStart),
        isSelected: selected ? isSameDay(day, selected) : false,
        isToday: isToday(day),
      });
      day = addDays(day, 1);
    }

    return days;
  });

  years = computed(() => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = currentYear - 50; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  });

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // ControlValueAccessor implementation
  writeValue(value: Date | string | null): void {
    if (value) {
      const date = value instanceof Date ? value : new Date(value);
      if (isValid(date)) {
        this.selectedDate.set(date);
        this.viewDate.set(date);
        this.inputValue.set(format(date, this.dateFormat()));
      }
    } else {
      this.selectedDate.set(null);
      this.inputValue.set('');
    }
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Event handlers
  toggleCalendar(): void {
    if (this.disabled) return;
    this.isOpen.update((open) => !open);
    if (this.isOpen() && !this.selectedDate()) {
      this.viewDate.set(new Date());
    }
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.inputValue.set(value);

    if (value) {
      const parsed = parse(value, this.dateFormat(), new Date());
      if (isValid(parsed)) {
        this.selectDate(parsed);
      }
    } else {
      this.selectedDate.set(null);
      this.onChange(null);
    }
  }

  onInputBlur(): void {
    this.onTouched();
    // Validate input on blur
    const value = this.inputValue();
    if (value) {
      const parsed = parse(value, this.dateFormat(), new Date());
      if (!isValid(parsed)) {
        // Reset to selected date or empty
        const selected = this.selectedDate();
        this.inputValue.set(selected ? format(selected, this.dateFormat()) : '');
      }
    }
  }

  selectDate(date: Date): void {
    const min = this.minDate();
    const max = this.maxDate();

    if (min && date < min) return;
    if (max && date > max) return;

    this.selectedDate.set(date);
    this.inputValue.set(format(date, this.dateFormat()));
    this.onChange(date);
    this.isOpen.set(false);
  }

  selectToday(): void {
    this.selectDate(new Date());
  }

  prevMonth(): void {
    this.viewDate.update((d) => subMonths(d, 1));
  }

  nextMonth(): void {
    this.viewDate.update((d) => addMonths(d, 1));
  }

  toggleYearPicker(): void {
    this.showYearPicker.update((show) => !show);
  }

  selectYear(year: number): void {
    this.viewDate.update((d) => setYear(d, year));
    this.showYearPicker.set(false);
  }

  selectMonth(monthIndex: number): void {
    this.viewDate.update((d) => setMonth(d, monthIndex));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.date-picker-container')) {
      this.isOpen.set(false);
      this.showYearPicker.set(false);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isOpen.set(false);
      this.showYearPicker.set(false);
    }
  }

  isDateDisabled(date: Date): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    if (min && date < min) return true;
    if (max && date > max) return true;
    return false;
  }
}
