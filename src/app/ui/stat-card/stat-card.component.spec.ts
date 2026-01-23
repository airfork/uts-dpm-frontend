import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatCardComponent } from './stat-card.component';

describe('StatCardComponent', () => {
  let component: StatCardComponent;
  let fixture: ComponentFixture<StatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatCardComponent);
    component = fixture.componentInstance;
    // Set required inputs
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('value', 42);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('required inputs', () => {
    it('should have title input', () => {
      expect(component.title()).toBe('Test Title');
    });

    it('should have value input as number', () => {
      expect(component.value()).toBe(42);
    });

    it('should accept string value', () => {
      fixture.componentRef.setInput('value', '$1,234');
      fixture.detectChanges();
      expect(component.value()).toBe('$1,234');
    });
  });

  describe('optional inputs', () => {
    it('should have empty subtitle by default', () => {
      expect(component.subtitle()).toBe('');
    });

    it('should have default variant by default', () => {
      expect(component.variant()).toBe('default');
    });

    it('should have empty icon by default', () => {
      expect(component.icon()).toBe('');
    });

    it('should accept subtitle', () => {
      fixture.componentRef.setInput('subtitle', 'Test Subtitle');
      fixture.detectChanges();
      expect(component.subtitle()).toBe('Test Subtitle');
    });
  });

  describe('containerClasses computed', () => {
    it('should include base classes', () => {
      const classes = component.containerClasses();
      expect(classes).toContain('p-4');
      expect(classes).toContain('rounded-lg');
      expect(classes).toContain('backdrop-blur');
      expect(classes).toContain('border');
    });

    it('should include default variant classes by default', () => {
      const classes = component.containerClasses();
      expect(classes).toContain('bg-secondary-500/20');
      expect(classes).toContain('border-secondary-400/30');
    });
  });

  describe('variant container classes', () => {
    it('should apply success variant classes', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      const classes = component.containerClasses();
      expect(classes).toContain('bg-success-500/20');
      expect(classes).toContain('border-success-400/30');
    });

    it('should apply error variant classes', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();
      const classes = component.containerClasses();
      expect(classes).toContain('bg-error-500/20');
      expect(classes).toContain('border-error-400/30');
    });

    it('should apply warning variant classes', () => {
      fixture.componentRef.setInput('variant', 'warning');
      fixture.detectChanges();
      const classes = component.containerClasses();
      expect(classes).toContain('bg-warning-500/20');
      expect(classes).toContain('border-warning-400/30');
    });

    it('should apply info variant classes', () => {
      fixture.componentRef.setInput('variant', 'info');
      fixture.detectChanges();
      const classes = component.containerClasses();
      expect(classes).toContain('bg-info-500/20');
      expect(classes).toContain('border-info-400/30');
    });
  });

  describe('titleClasses computed', () => {
    it('should include base title classes', () => {
      const classes = component.titleClasses();
      expect(classes).toContain('text-xs');
      expect(classes).toContain('uppercase');
      expect(classes).toContain('tracking-wide');
      expect(classes).toContain('font-medium');
    });

    it('should include default variant title color', () => {
      const classes = component.titleClasses();
      expect(classes).toContain('text-secondary-100');
    });

    it('should include success variant title color', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      const classes = component.titleClasses();
      expect(classes).toContain('text-success-100');
    });

    it('should include error variant title color', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();
      const classes = component.titleClasses();
      expect(classes).toContain('text-error-100');
    });
  });

  describe('valueClasses computed', () => {
    it('should include base value classes', () => {
      const classes = component.valueClasses();
      expect(classes).toContain('text-2xl');
      expect(classes).toContain('font-bold');
      expect(classes).toContain('mt-1');
    });

    it('should include white text for all variants', () => {
      const classes = component.valueClasses();
      expect(classes).toContain('text-white');
    });

    it('should include white text for success variant', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      const classes = component.valueClasses();
      expect(classes).toContain('text-white');
    });
  });
});
