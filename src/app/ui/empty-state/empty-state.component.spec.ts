import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    // Set required inputs
    fixture.componentRef.setInput('heading', 'No Data Found');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('required inputs', () => {
    it('should have heading input', () => {
      expect(component.heading()).toBe('No Data Found');
    });
  });

  describe('optional inputs', () => {
    it('should have pi-inbox as default icon', () => {
      expect(component.icon()).toBe('pi-inbox');
    });

    it('should have empty description by default', () => {
      expect(component.description()).toBe('');
    });

    it('should accept custom icon', () => {
      fixture.componentRef.setInput('icon', 'pi-search');
      fixture.detectChanges();
      expect(component.icon()).toBe('pi-search');
    });

    it('should accept description', () => {
      fixture.componentRef.setInput('description', 'Try a different search');
      fixture.detectChanges();
      expect(component.description()).toBe('Try a different search');
    });
  });
});
