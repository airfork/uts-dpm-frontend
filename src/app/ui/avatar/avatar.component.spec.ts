import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    it('should have empty name by default', () => {
      expect(component.name()).toBe('');
    });

    it('should have empty imageUrl by default', () => {
      expect(component.imageUrl()).toBe('');
    });

    it('should have md size by default', () => {
      expect(component.size()).toBe('md');
    });

    it('should have primary variant by default', () => {
      expect(component.variant()).toBe('primary');
    });
  });

  describe('initials computed', () => {
    it('should return ? for empty name', () => {
      expect(component.initials()).toBe('?');
    });

    it('should return first two letters for single word name', () => {
      fixture.componentRef.setInput('name', 'John');
      fixture.detectChanges();
      expect(component.initials()).toBe('JO');
    });

    it('should return first and last initials for two word name', () => {
      fixture.componentRef.setInput('name', 'John Doe');
      fixture.detectChanges();
      expect(component.initials()).toBe('JD');
    });

    it('should return first and last initials for multi-word name', () => {
      fixture.componentRef.setInput('name', 'John Middle Doe');
      fixture.detectChanges();
      expect(component.initials()).toBe('JD');
    });

    it('should handle names with extra whitespace', () => {
      fixture.componentRef.setInput('name', '  John   Doe  ');
      fixture.detectChanges();
      expect(component.initials()).toBe('JD');
    });

    it('should uppercase initials', () => {
      fixture.componentRef.setInput('name', 'john doe');
      fixture.detectChanges();
      expect(component.initials()).toBe('JD');
    });
  });

  describe('containerClasses computed', () => {
    it('should include base classes', () => {
      const classes = component.containerClasses();
      expect(classes).toContain('rounded-full');
      expect(classes).toContain('flex');
      expect(classes).toContain('items-center');
      expect(classes).toContain('justify-center');
      expect(classes).toContain('font-semibold');
      expect(classes).toContain('text-white');
    });

    it('should include md size classes by default', () => {
      const classes = component.containerClasses();
      expect(classes).toContain('w-10');
      expect(classes).toContain('h-10');
      expect(classes).toContain('text-sm');
    });

    it('should include primary variant classes by default', () => {
      const classes = component.containerClasses();
      expect(classes).toContain('bg-gradient-to-br');
      expect(classes).toContain('from-primary-400');
      expect(classes).toContain('to-primary-600');
    });
  });

  describe('size classes', () => {
    it('should apply xs size classes', () => {
      fixture.componentRef.setInput('size', 'xs');
      fixture.detectChanges();
      const classes = component.containerClasses();
      expect(classes).toContain('w-6');
      expect(classes).toContain('h-6');
      expect(classes).toContain('text-xs');
    });

    it('should apply sm size classes', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      const classes = component.containerClasses();
      expect(classes).toContain('w-8');
      expect(classes).toContain('h-8');
    });

    it('should apply lg size classes', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      const classes = component.containerClasses();
      expect(classes).toContain('w-12');
      expect(classes).toContain('h-12');
      expect(classes).toContain('text-base');
    });

    it('should apply xl size classes', () => {
      fixture.componentRef.setInput('size', 'xl');
      fixture.detectChanges();
      const classes = component.containerClasses();
      expect(classes).toContain('w-16');
      expect(classes).toContain('h-16');
      expect(classes).toContain('text-lg');
    });
  });

  describe('variant classes', () => {
    it('should apply secondary variant classes', () => {
      fixture.componentRef.setInput('variant', 'secondary');
      fixture.detectChanges();
      const classes = component.containerClasses();
      expect(classes).toContain('from-secondary-400');
      expect(classes).toContain('to-secondary-600');
    });

    it('should apply success variant classes', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();
      const classes = component.containerClasses();
      expect(classes).toContain('from-success-400');
      expect(classes).toContain('to-success-600');
    });

    it('should apply error variant classes', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();
      const classes = component.containerClasses();
      expect(classes).toContain('from-error-400');
      expect(classes).toContain('to-error-600');
    });

    it('should apply neutral variant classes', () => {
      fixture.componentRef.setInput('variant', 'neutral');
      fixture.detectChanges();
      const classes = component.containerClasses();
      expect(classes).toContain('from-neutral-400');
      expect(classes).toContain('to-neutral-600');
    });
  });
});
