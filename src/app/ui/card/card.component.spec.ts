import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    it('should have default variant', () => {
      expect(component.variant()).toBe('default');
    });

    it('should have md padding by default', () => {
      expect(component.padding()).toBe('md');
    });

    it('should have hover as false by default', () => {
      expect(component.hover()).toBe(false);
    });
  });

  describe('classes computed', () => {
    it('should include base classes', () => {
      const classes = component.classes();
      expect(classes).toContain('rounded-lg');
      expect(classes).toContain('transition-all');
    });

    it('should include default variant classes', () => {
      const classes = component.classes();
      expect(classes).toContain('bg-base-100');
      expect(classes).toContain('shadow-[var(--shadow-base)]');
    });

    it('should include md padding class by default', () => {
      const classes = component.classes();
      expect(classes).toContain('p-6');
    });

    it('should not include hover classes by default', () => {
      const classes = component.classes();
      expect(classes).not.toContain('hover:shadow-[var(--shadow-lg)]');
      expect(classes).not.toContain('cursor-pointer');
    });
  });

  describe('variant classes', () => {
    it('should apply elevated variant classes', () => {
      fixture.componentRef.setInput('variant', 'elevated');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('bg-base-100');
      expect(classes).toContain('shadow-[var(--shadow-md)]');
    });

    it('should apply outlined variant classes', () => {
      fixture.componentRef.setInput('variant', 'outlined');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('bg-base-100');
      expect(classes).toContain('border-2');
      expect(classes).toContain('border-neutral-300');
    });
  });

  describe('padding classes', () => {
    it('should apply sm padding class', () => {
      fixture.componentRef.setInput('padding', 'sm');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('p-4');
    });

    it('should apply lg padding class', () => {
      fixture.componentRef.setInput('padding', 'lg');
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('p-8');
    });
  });

  describe('hover classes', () => {
    it('should include hover classes when hover is true', () => {
      fixture.componentRef.setInput('hover', true);
      fixture.detectChanges();
      const classes = component.classes();
      expect(classes).toContain('hover:shadow-[var(--shadow-lg)]');
      expect(classes).toContain('cursor-pointer');
    });
  });
});
