import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AutoResizeDirective } from './auto-resize.directive';

@Component({
  template: ` <textarea appAutoResize [minRows]="minRows" data-testid="textarea"></textarea> `,
  imports: [AutoResizeDirective],
})
class TestHostComponent {
  minRows = 1;
}

describe('AutoResizeDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let textareaEl: HTMLTextAreaElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    textareaEl = fixture.nativeElement.querySelector('[data-testid="textarea"]');
  });

  it('should create', () => {
    expect(textareaEl).toBeTruthy();
  });

  it('should have overflow hidden', () => {
    expect(textareaEl.style.overflow).toBe('hidden');
  });

  it('should resize on input', fakeAsync(() => {
    // Add content
    textareaEl.value = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
    textareaEl.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();

    // Height should be set
    expect(textareaEl.style.height).toBeTruthy();
  }));

  it('should respect minRows input', fakeAsync(() => {
    // Create a new fixture with minRows set from the start
    const minRowsFixture = TestBed.createComponent(TestHostComponent);
    minRowsFixture.componentInstance.minRows = 3;
    minRowsFixture.detectChanges();
    tick();

    const minRowsTextareaEl = minRowsFixture.nativeElement.querySelector(
      '[data-testid="textarea"]'
    );
    // Textarea should have minimum height based on minRows
    expect(minRowsTextareaEl.style.height).toBeTruthy();
    minRowsFixture.destroy();
  }));

  it('should cleanup observer on destroy', () => {
    spyOn(IntersectionObserver.prototype, 'disconnect');
    fixture.destroy();
    expect(IntersectionObserver.prototype.disconnect).toHaveBeenCalled();
  });
});
