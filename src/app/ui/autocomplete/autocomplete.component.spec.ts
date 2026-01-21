import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AutocompleteComponent } from './autocomplete.component';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;

  const mockSuggestions = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    it('should have empty suggestions by default', () => {
      expect(component.suggestions()).toEqual([]);
    });

    it('should have empty placeholder by default', () => {
      expect(component.placeholder()).toBe('');
    });

    it('should have forceSelection as false by default', () => {
      expect(component.forceSelection()).toBe(false);
    });

    it('should have showEmptyMessage as true by default', () => {
      expect(component.showEmptyMessage()).toBe(true);
    });

    it('should have default emptyMessage', () => {
      expect(component.emptyMessage()).toBe('No results found');
    });

    it('should be closed by default', () => {
      expect(component.isOpen()).toBe(false);
    });

    it('should have highlightedIndex as -1 by default', () => {
      expect(component.highlightedIndex()).toBe(-1);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue('Test');
      expect(component.inputValue()).toBe('Test');
    });

    it('should handle null value', () => {
      component.writeValue(null as unknown as string);
      expect(component.inputValue()).toBe('');
    });

    it('should register onChange callback', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      fixture.componentRef.setInput('suggestions', mockSuggestions);
      fixture.detectChanges();
      component.selectSuggestion('Apple');
      expect(fn).toHaveBeenCalledWith('Apple');
    });

    it('should register onTouched callback', fakeAsync(() => {
      const fn = jasmine.createSpy('onTouched');
      component.registerOnTouched(fn);
      component.onInputBlur();
      tick(200);
      expect(fn).toHaveBeenCalled();
    }));

    it('should set disabled state', () => {
      expect(component.disabled).toBe(false);
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
    });
  });

  describe('onInputChange', () => {
    it('should update inputValue', () => {
      const event = { target: { value: 'App' } } as unknown as Event;
      component.onInputChange(event);
      expect(component.inputValue()).toBe('App');
    });

    it('should open suggestions panel', () => {
      const event = { target: { value: 'App' } } as unknown as Event;
      component.onInputChange(event);
      expect(component.isOpen()).toBe(true);
    });

    it('should emit completeMethod event', () => {
      spyOn(component.completeMethod, 'emit');
      const event = { target: { value: 'App' } } as unknown as Event;
      component.onInputChange(event);
      expect(component.completeMethod.emit).toHaveBeenCalledWith({
        query: 'App',
      });
    });

    it('should reset highlightedIndex', () => {
      component.highlightedIndex.set(2);
      const event = { target: { value: 'App' } } as unknown as Event;
      component.onInputChange(event);
      expect(component.highlightedIndex()).toBe(-1);
    });

    it('should call onChange when forceSelection is false', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      const event = { target: { value: 'Test' } } as unknown as Event;
      component.onInputChange(event);
      expect(fn).toHaveBeenCalledWith('Test');
    });

    it('should not call onChange when forceSelection is true', () => {
      fixture.componentRef.setInput('forceSelection', true);
      fixture.detectChanges();
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      const event = { target: { value: 'Test' } } as unknown as Event;
      component.onInputChange(event);
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('onInputFocus', () => {
    it('should set isFocused to true', () => {
      component.onInputFocus();
      expect(component.isFocused()).toBe(true);
    });

    it('should open panel if there is input value', () => {
      component.inputValue.set('Test');
      spyOn(component.completeMethod, 'emit');
      component.onInputFocus();
      expect(component.isOpen()).toBe(true);
      expect(component.completeMethod.emit).toHaveBeenCalled();
    });

    it('should not open panel if input is empty', () => {
      component.onInputFocus();
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('onInputBlur', () => {
    it('should set isFocused to false', () => {
      component.isFocused.set(true);
      component.onInputBlur();
      expect(component.isFocused()).toBe(false);
    });

    it('should clear value if forceSelection and value not in suggestions', fakeAsync(() => {
      fixture.componentRef.setInput('forceSelection', true);
      fixture.componentRef.setInput('suggestions', mockSuggestions);
      fixture.detectChanges();

      component.inputValue.set('Invalid');
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);

      component.onInputBlur();
      tick(200);

      expect(component.inputValue()).toBe('');
      expect(fn).toHaveBeenCalledWith('');
    }));

    it('should not clear value if in suggestions', fakeAsync(() => {
      fixture.componentRef.setInput('forceSelection', true);
      fixture.componentRef.setInput('suggestions', mockSuggestions);
      fixture.detectChanges();

      component.inputValue.set('Apple');

      component.onInputBlur();
      tick(200);

      expect(component.inputValue()).toBe('Apple');
    }));

    it('should close panel after delay', fakeAsync(() => {
      component.isOpen.set(true);
      component.onInputBlur();
      tick(200);
      expect(component.isOpen()).toBe(false);
    }));
  });

  describe('selectSuggestion', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('suggestions', mockSuggestions);
      fixture.detectChanges();
    });

    it('should set inputValue', () => {
      component.selectSuggestion('Apple');
      expect(component.inputValue()).toBe('Apple');
    });

    it('should call onChange', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      component.selectSuggestion('Apple');
      expect(fn).toHaveBeenCalledWith('Apple');
    });

    it('should emit selected event', () => {
      spyOn(component.selected, 'emit');
      component.selectSuggestion('Apple');
      expect(component.selected.emit).toHaveBeenCalledWith('Apple');
    });

    it('should close panel', () => {
      component.isOpen.set(true);
      component.selectSuggestion('Apple');
      expect(component.isOpen()).toBe(false);
    });

    it('should reset highlightedIndex', () => {
      component.highlightedIndex.set(2);
      component.selectSuggestion('Apple');
      expect(component.highlightedIndex()).toBe(-1);
    });
  });

  describe('keyboard navigation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('suggestions', mockSuggestions);
      fixture.detectChanges();
      component.isOpen.set(true);
    });

    it('should navigate down with ArrowDown', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      spyOn(event, 'preventDefault');
      component.onKeyDown(event);
      expect(component.highlightedIndex()).toBe(0);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should navigate up with ArrowUp', () => {
      component.highlightedIndex.set(2);
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      spyOn(event, 'preventDefault');
      component.onKeyDown(event);
      expect(component.highlightedIndex()).toBe(1);
    });

    it('should not go below 0 with ArrowUp', () => {
      component.highlightedIndex.set(0);
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      component.onKeyDown(event);
      expect(component.highlightedIndex()).toBe(0);
    });

    it('should not go beyond suggestions length with ArrowDown', () => {
      component.highlightedIndex.set(4);
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.onKeyDown(event);
      expect(component.highlightedIndex()).toBe(4);
    });

    it('should select on Enter', () => {
      component.highlightedIndex.set(1);
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(event, 'preventDefault');
      spyOn(component, 'selectSuggestion');
      component.onKeyDown(event);
      expect(component.selectSuggestion).toHaveBeenCalledWith('Apricot');
    });

    it('should close on Escape', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeyDown(event);
      expect(component.isOpen()).toBe(false);
      expect(component.highlightedIndex()).toBe(-1);
    });

    it('should not handle keys when closed', () => {
      component.isOpen.set(false);
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.onKeyDown(event);
      expect(component.highlightedIndex()).toBe(-1);
    });
  });

  describe('getHighlightParts', () => {
    it('should return single part for no match', () => {
      component.inputValue.set('xyz');
      const parts = component.getHighlightParts('Apple');
      expect(parts).toEqual([{ text: 'Apple', highlight: false }]);
    });

    it('should return highlighted parts for match', () => {
      component.inputValue.set('app');
      const parts = component.getHighlightParts('Apple');
      expect(parts.length).toBe(2);
      expect(parts[0]).toEqual({ text: 'App', highlight: true });
      expect(parts[1]).toEqual({ text: 'le', highlight: false });
    });

    it('should handle match at end', () => {
      component.inputValue.set('le');
      const parts = component.getHighlightParts('Apple');
      expect(parts.length).toBe(2);
      expect(parts[0]).toEqual({ text: 'App', highlight: false });
      expect(parts[1]).toEqual({ text: 'le', highlight: true });
    });

    it('should return single part for empty query', () => {
      component.inputValue.set('');
      const parts = component.getHighlightParts('Apple');
      expect(parts).toEqual([{ text: 'Apple', highlight: false }]);
    });
  });
});
