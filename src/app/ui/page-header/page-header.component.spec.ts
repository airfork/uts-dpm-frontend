import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    // Set required inputs
    fixture.componentRef.setInput('icon', 'pi-home');
    fixture.componentRef.setInput('title', 'Dashboard');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('required inputs', () => {
    it('should have icon input', () => {
      expect(component.icon()).toBe('pi-home');
    });

    it('should have title input', () => {
      expect(component.title()).toBe('Dashboard');
    });
  });

  describe('optional inputs', () => {
    it('should have empty subtitle by default', () => {
      expect(component.subtitle()).toBe('');
    });

    it('should have primary variant by default', () => {
      expect(component.variant()).toBe('primary');
    });

    it('should have showGradient as false by default', () => {
      expect(component.showGradient()).toBe(false);
    });

    it('should accept subtitle', () => {
      fixture.componentRef.setInput('subtitle', 'Welcome back');
      fixture.detectChanges();
      expect(component.subtitle()).toBe('Welcome back');
    });

    it('should accept custom variant', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      expect(component.variant()).toBe('success');
    });

    it('should accept showGradient', () => {
      fixture.componentRef.setInput('showGradient', true);
      fixture.detectChanges();
      expect(component.showGradient()).toBe(true);
    });
  });

  describe('iconClasses computed', () => {
    it('should include base classes', () => {
      const classes = component.iconClasses();
      expect(classes).toContain('w-10');
      expect(classes).toContain('h-10');
      expect(classes).toContain('rounded-xl');
      expect(classes).toContain('flex');
      expect(classes).toContain('items-center');
      expect(classes).toContain('justify-center');
      expect(classes).toContain('shadow-lg');
    });

    it('should include primary variant classes by default', () => {
      const classes = component.iconClasses();
      expect(classes).toContain('bg-gradient-to-br');
      expect(classes).toContain('from-primary-500');
      expect(classes).toContain('to-primary-600');
      expect(classes).toContain('shadow-primary-500/20');
    });
  });

  describe('variant icon classes', () => {
    it('should apply secondary variant classes', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();
      const classes = component.iconClasses();
      expect(classes).toContain('from-secondary-500');
      expect(classes).toContain('to-secondary-600');
      expect(classes).toContain('shadow-secondary-500/20');
    });

    it('should apply success variant classes', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      const classes = component.iconClasses();
      expect(classes).toContain('from-success-500');
      expect(classes).toContain('to-success-600');
      expect(classes).toContain('shadow-success-500/20');
    });

    it('should apply info variant classes', () => {
      fixture.componentRef.setInput('variant', 'info');
      fixture.detectChanges();
      const classes = component.iconClasses();
      expect(classes).toContain('from-info-500');
      expect(classes).toContain('to-info-600');
      expect(classes).toContain('shadow-info-500/20');
    });
  });
});
