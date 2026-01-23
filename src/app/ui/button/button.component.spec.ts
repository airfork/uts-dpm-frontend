import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    it('should have primary variant by default', () => {
      expect(component.variant()).toBe('primary');
    });

    it('should have md size by default', () => {
      expect(component.size()).toBe('md');
    });

    it('should have fullWidth as false by default', () => {
      expect(component.fullWidth()).toBe(false);
    });

    it('should have disabled as false by default', () => {
      expect(component.disabled()).toBe(false);
    });

    it('should have button type by default', () => {
      expect(component.type()).toBe('button');
    });
  });

  describe('classes computed', () => {
    it('should include base classes', () => {
      const classes = component.classes();
      expect(classes).toContain('inline-flex');
      expect(classes).toContain('items-center');
      expect(classes).toContain('justify-center');
      expect(classes).toContain('font-semibold');
      expect(classes).toContain('rounded-lg');
    });

    it('should include primary variant classes by default', () => {
      const classes = component.classes();
      expect(classes).toContain('bg-gradient-to-r');
      expect(classes).toContain('from-primary-600');
    });

    it('should include md size classes by default', () => {
      const classes = component.classes();
      expect(classes).toContain('px-4');
      expect(classes).toContain('py-2');
    });

    it('should not include w-full by default', () => {
      const classes = component.classes();
      expect(classes).not.toContain('w-full');
    });
  });

  describe('variant classes', () => {
    it('should apply secondary variant classes', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('btn-secondary');
    });

    it('should apply ghost variant classes', () => {
      fixture.componentRef.setInput('variant', 'ghost');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('btn-ghost');
    });

    it('should apply outline variant classes', () => {
      fixture.componentRef.setInput('variant', 'outline');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('btn-outline');
    });

    it('should apply success variant classes', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('from-success-600');
    });

    it('should apply error variant classes', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('from-error-600');
    });
  });

  describe('size classes', () => {
    it('should apply sm size classes', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('px-3');
      expect(classes).toContain('py-1.5');
    });

    it('should apply lg size classes', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('px-6');
      expect(classes).toContain('py-3');
    });
  });

  describe('fullWidth', () => {
    it('should include w-full when fullWidth is true', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('w-full');
    });
  });
});
