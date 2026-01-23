import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollapsibleComponent } from './collapsible.component';

describe('CollapsibleComponent', () => {
  let component: CollapsibleComponent;
  let fixture: ComponentFixture<CollapsibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollapsibleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollapsibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    it('should have collapsed as false by default', () => {
      expect(component.collapsed()).toBe(false);
    });

    it('should have empty headerClass by default', () => {
      expect(component.headerClass()).toBe('');
    });

    it('should have empty contentClass by default', () => {
      expect(component.contentClass()).toBe('');
    });

    it('should have isCollapsed as false by default', () => {
      expect(component.isCollapsed()).toBe(false);
    });
  });

  describe('toggle method', () => {
    it('should toggle isCollapsed from false to true', () => {
      expect(component.isCollapsed()).toBe(false);
      component.toggle();
      expect(component.isCollapsed()).toBe(true);
    });

    it('should toggle isCollapsed from true to false', () => {
      // Set to true first using toggle
      component.toggle();
      expect(component.isCollapsed()).toBe(true);

      // Then toggle back to false
      component.toggle();
      expect(component.isCollapsed()).toBe(false);
    });

    it('should toggle multiple times', () => {
      expect(component.isCollapsed()).toBe(false);

      component.toggle();
      expect(component.isCollapsed()).toBe(true);

      component.toggle();
      expect(component.isCollapsed()).toBe(false);

      component.toggle();
      expect(component.isCollapsed()).toBe(true);
    });
  });

  describe('inputs', () => {
    it('should accept headerClass input', () => {
      fixture.componentRef.setInput('headerClass', 'custom-header');
      fixture.detectChanges();
      expect(component.headerClass()).toBe('custom-header');
    });

    it('should accept contentClass input', () => {
      fixture.componentRef.setInput('contentClass', 'custom-content');
      fixture.detectChanges();
      expect(component.contentClass()).toBe('custom-content');
    });
  });
});
