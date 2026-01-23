import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { Component, signal } from '@angular/core';

// Test host component to test modal with inputs and outputs
@Component({
  template: `
    <app-modal
      [open]="isOpen()"
      [size]="size()"
      [closeOnBackdrop]="closeOnBackdrop()"
      [closeOnEscape]="closeOnEscape()"
      (close)="onClose()"
    >
      <div modal-header>Test Modal</div>
      <div modal-body>Modal content</div>
      <div modal-footer>Footer content</div>
    </app-modal>
  `,
  standalone: true,
  imports: [ModalComponent],
})
class TestHostComponent {
  isOpen = signal(false);
  size = signal<'sm' | 'md' | 'lg' | 'xl'>('md');
  closeOnBackdrop = signal(true);
  closeOnEscape = signal(true);
  closeCalled = false;

  onClose(): void {
    this.closeCalled = true;
  }
}

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input signals', () => {
    it('should have default size of md', () => {
      expect(component.size()).toBe('md');
    });

    it('should have default closeOnBackdrop of true', () => {
      expect(component.closeOnBackdrop()).toBe(true);
    });

    it('should have default closeOnEscape of true', () => {
      expect(component.closeOnEscape()).toBe(true);
    });
  });

  describe('Output signals', () => {
    it('should emit close event when handleClose is called', () => {
      let closeCalled = false;
      component.close.subscribe(() => {
        closeCalled = true;
      });

      component.handleClose();

      expect(closeCalled).toBe(true);
    });
  });

  describe('Open/close behavior', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
    });

    it('should not render modal when open is false', () => {
      hostComponent.isOpen.set(false);
      hostFixture.detectChanges();

      const modalElement = hostFixture.nativeElement.querySelector('[role="dialog"]');
      expect(modalElement).toBeNull();
    });

    it('should render modal when open is true', () => {
      hostComponent.isOpen.set(true);
      hostFixture.detectChanges();

      const modalElement = hostFixture.nativeElement.querySelector('[role="dialog"]');
      expect(modalElement).toBeTruthy();
    });

    it('should emit close event when close button is clicked', () => {
      hostComponent.isOpen.set(true);
      hostFixture.detectChanges();

      const closeButton = hostFixture.nativeElement.querySelector(
        'button[aria-label="Close modal"]'
      );
      closeButton?.click();
      hostFixture.detectChanges();

      expect(hostComponent.closeCalled).toBe(true);
    });

    it('should emit close event when backdrop is clicked', () => {
      hostComponent.isOpen.set(true);
      hostComponent.closeOnBackdrop.set(true);
      hostFixture.detectChanges();

      const backdrop = hostFixture.nativeElement.querySelector('.fixed.inset-0.bg-black\\/50');
      backdrop?.click();
      hostFixture.detectChanges();

      expect(hostComponent.closeCalled).toBe(true);
    });

    it('should not emit close event when backdrop is clicked and closeOnBackdrop is false', () => {
      hostComponent.isOpen.set(true);
      hostComponent.closeOnBackdrop.set(false);
      hostFixture.detectChanges();

      const backdrop = hostFixture.nativeElement.querySelector('.fixed.inset-0.bg-black\\/50');
      backdrop?.click();
      hostFixture.detectChanges();

      expect(hostComponent.closeCalled).toBe(false);
    });
  });

  describe('Accessibility', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
    });

    it('should have proper ARIA attributes', () => {
      hostComponent.isOpen.set(true);
      hostFixture.detectChanges();

      const dialog = hostFixture.nativeElement.querySelector('[role="dialog"]');
      expect(dialog.getAttribute('aria-modal')).toBe('true');
      expect(dialog.getAttribute('aria-labelledby')).toBe('modal-title');
      expect(dialog.getAttribute('tabindex')).toBe('-1');
    });

    it('should have modal-title id on header', () => {
      hostComponent.isOpen.set(true);
      hostFixture.detectChanges();

      const title = hostFixture.nativeElement.querySelector('#modal-title');
      expect(title).toBeTruthy();
    });
  });
});
