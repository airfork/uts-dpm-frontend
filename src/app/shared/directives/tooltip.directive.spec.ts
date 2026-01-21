import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TooltipDirective, TooltipPosition } from './tooltip.directive';

@Component({
  template: `
    <button
      [appTooltip]="tooltipText"
      [tooltipPosition]="position"
      [tooltipDelay]="delay"
      data-testid="button"
    >
      Hover me
    </button>
  `,
  imports: [TooltipDirective],
})
class TestHostComponent {
  tooltipText = 'Test tooltip';
  position: TooltipPosition = 'top';
  delay = 200;
}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let buttonEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    buttonEl = fixture.nativeElement.querySelector('[data-testid="button"]');
  });

  afterEach(() => {
    // Clean up any tooltips
    const tooltips = document.querySelectorAll('.tooltip-container');
    tooltips.forEach((t) => t.remove());
  });

  it('should create', () => {
    expect(buttonEl).toBeTruthy();
  });

  it('should show tooltip on mouseenter after delay', fakeAsync(() => {
    buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
    tick(200);

    const tooltip = document.querySelector('.tooltip-container');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toBe('Test tooltip');
  }));

  it('should hide tooltip on mouseleave', fakeAsync(() => {
    buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
    tick(200);

    let tooltip = document.querySelector('.tooltip-container');
    expect(tooltip).toBeTruthy();

    buttonEl.dispatchEvent(new MouseEvent('mouseleave'));

    tooltip = document.querySelector('.tooltip-container');
    expect(tooltip).toBeFalsy();
  }));

  it('should show tooltip on focus', fakeAsync(() => {
    buttonEl.dispatchEvent(new FocusEvent('focus'));
    tick(0);

    const tooltip = document.querySelector('.tooltip-container');
    expect(tooltip).toBeTruthy();
  }));

  it('should hide tooltip on blur', fakeAsync(() => {
    buttonEl.dispatchEvent(new FocusEvent('focus'));
    tick(0);

    buttonEl.dispatchEvent(new FocusEvent('blur'));

    const tooltip = document.querySelector('.tooltip-container');
    expect(tooltip).toBeFalsy();
  }));

  it('should not show tooltip if text is empty', fakeAsync(() => {
    // Create a new fixture with empty text from the start
    const emptyTextFixture = TestBed.createComponent(TestHostComponent);
    emptyTextFixture.componentInstance.tooltipText = '';
    emptyTextFixture.detectChanges();
    const emptyButtonEl = emptyTextFixture.nativeElement.querySelector('[data-testid="button"]');

    emptyButtonEl.dispatchEvent(new MouseEvent('mouseenter'));
    tick(200);

    const tooltip = document.querySelector('.tooltip-container');
    expect(tooltip).toBeFalsy();
    emptyTextFixture.destroy();
  }));

  it('should cancel show on quick mouseleave', fakeAsync(() => {
    buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
    tick(100); // Less than delay

    buttonEl.dispatchEvent(new MouseEvent('mouseleave'));
    tick(200);

    const tooltip = document.querySelector('.tooltip-container');
    expect(tooltip).toBeFalsy();
  }));

  it('should cleanup on destroy', fakeAsync(() => {
    buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
    tick(200);

    fixture.destroy();

    const tooltip = document.querySelector('.tooltip-container');
    expect(tooltip).toBeFalsy();
  }));
});
