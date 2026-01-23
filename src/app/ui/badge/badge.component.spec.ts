import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    it('should have neutral variant by default', () => {
      expect(component.variant()).toBe('neutral');
    });

    it('should have md size by default', () => {
      expect(component.size()).toBe('md');
    });

    it('should have showIcon as false by default', () => {
      expect(component.showIcon()).toBe(false);
    });

    it('should have pill as true by default', () => {
      expect(component.pill()).toBe(true);
    });
  });

  describe('classes computed', () => {
    it('should include base classes', () => {
      const classes = component.classes();
      expect(classes).toContain('inline-flex');
      expect(classes).toContain('items-center');
      expect(classes).toContain('font-medium');
    });

    it('should include rounded-full when pill is true', () => {
      const classes = component.classes();
      expect(classes).toContain('rounded-full');
    });

    it('should include rounded-md when pill is false', () => {
      fixture.componentRef.setInput('pill', false);
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('rounded-md');
      expect(classes).not.toContain('rounded-full');
    });

    it('should include neutral variant classes by default', () => {
      const classes = component.classes();
      expect(classes).toContain('bg-neutral-100');
      expect(classes).toContain('text-neutral-700');
    });

    it('should include md size classes by default', () => {
      const classes = component.classes();
      expect(classes).toContain('px-2');
      expect(classes).toContain('py-0.5');
      expect(classes).toContain('text-xs');
    });
  });

  describe('variant classes', () => {
    it('should apply success variant classes', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('bg-success-50');
      expect(classes).toContain('text-success-700');
    });

    it('should apply error variant classes', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('bg-error-50');
      expect(classes).toContain('text-error-700');
    });

    it('should apply warning variant classes', () => {
      fixture.componentRef.setInput('variant', 'warning');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('bg-warning-50');
      expect(classes).toContain('text-warning-700');
    });

    it('should apply info variant classes', () => {
      fixture.componentRef.setInput('variant', 'info');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('bg-info-50');
      expect(classes).toContain('text-info-700');
    });

    it('should apply primary variant classes', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('bg-primary-50');
      expect(classes).toContain('text-primary-700');
    });

    it('should apply secondary variant classes', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('bg-secondary-50');
      expect(classes).toContain('text-secondary-700');
    });
  });

  describe('size classes', () => {
    it('should apply sm size classes', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('px-1.5');
      expect(classes).toContain('py-0.5');
      expect(classes).toContain('text-xs');
    });

    it('should apply lg size classes', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('px-2.5');
      expect(classes).toContain('py-1');
      expect(classes).toContain('text-sm');
    });
  });

  describe('iconPath computed', () => {
    it('should return check icon path for success variant', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      expect(component.iconPath()).toBe('M5 13l4 4L19 7');
    });

    it('should return X icon path for error variant', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();
      expect(component.iconPath()).toBe('M6 18L18 6M6 6l12 12');
    });

    it('should return warning icon path for warning variant', () => {
      fixture.componentRef.setInput('variant', 'warning');
      fixture.detectChanges();
      expect(component.iconPath()).toContain('M12 9v2');
    });

    it('should return info icon path for info variant', () => {
      fixture.componentRef.setInput('variant', 'info');
      fixture.detectChanges();
      expect(component.iconPath()).toContain('M13 16h-1v-4h-1');
    });

    it('should return empty string for neutral variant', () => {
      fixture.componentRef.setInput('variant', 'neutral');
      fixture.detectChanges();
      expect(component.iconPath()).toBe('');
    });

    it('should return empty string for primary variant', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      expect(component.iconPath()).toBe('');
    });
  });
});
