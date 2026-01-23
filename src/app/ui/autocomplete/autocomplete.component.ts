import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutocompleteCompleteEvent } from './autocomplete.types';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  standalone: true,
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent implements ControlValueAccessor {
  // Inputs
  suggestions = input<string[]>([]);
  placeholder = input<string>('');
  forceSelection = input<boolean>(false);
  showEmptyMessage = input<boolean>(true);
  emptyMessage = input<string>('No results found');
  inputClass = input<string>('');
  panelClass = input<string>('');
  inputId = input<string>('');

  // Outputs
  completeMethod = output<AutocompleteCompleteEvent>();
  selected = output<string>();

  // Internal state
  isOpen = signal(false);
  highlightedIndex = signal(-1);
  inputValue = signal('');
  isFocused = signal(false);

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  // ControlValueAccessor
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  disabled = false;

  writeValue(value: string): void {
    this.inputValue.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Event handlers
  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const query = target.value;
    this.inputValue.set(query);

    if (!this.forceSelection()) {
      this.onChange(query);
    }

    this.completeMethod.emit({ query });
    this.isOpen.set(true);
    this.highlightedIndex.set(-1);
  }

  onInputFocus(): void {
    this.isFocused.set(true);
    if (this.inputValue()) {
      this.completeMethod.emit({ query: this.inputValue() });
      this.isOpen.set(true);
    }
  }

  onInputBlur(): void {
    this.isFocused.set(false);
    this.onTouched();

    // Delay to allow click on suggestion
    setTimeout(() => {
      if (this.forceSelection() && !this.suggestions().includes(this.inputValue())) {
        // Only call onChange if the value is actually being cleared (was not already empty)
        // This prevents marking the form dirty when user just focuses and blurs without typing
        const currentValue = this.inputValue();
        if (currentValue) {
          this.inputValue.set('');
          this.onChange('');
        }
      }
      this.isOpen.set(false);
    }, 200);
  }

  selectSuggestion(suggestion: string): void {
    this.inputValue.set(suggestion);
    this.onChange(suggestion);
    this.selected.emit(suggestion);
    this.isOpen.set(false);
    this.highlightedIndex.set(-1);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen()) return;

    const suggestions = this.suggestions();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex.update((i) => Math.min(i + 1, suggestions.length - 1));
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex.update((i) => Math.max(i - 1, 0));
        break;

      case 'Enter':
        event.preventDefault();
        const index = this.highlightedIndex();
        if (index >= 0 && index < suggestions.length) {
          this.selectSuggestion(suggestions[index]);
        }
        break;

      case 'Escape':
        this.isOpen.set(false);
        this.highlightedIndex.set(-1);
        break;
    }
  }

  getHighlightParts(text: string): { text: string; highlight: boolean }[] {
    const query = this.inputValue().toLowerCase();
    if (!query) return [{ text, highlight: false }];

    const index = text.toLowerCase().indexOf(query);
    if (index === -1) return [{ text, highlight: false }];

    return [
      { text: text.slice(0, index), highlight: false },
      { text: text.slice(index, index + query.length), highlight: true },
      { text: text.slice(index + query.length), highlight: false },
    ].filter((p) => p.text);
  }
}
