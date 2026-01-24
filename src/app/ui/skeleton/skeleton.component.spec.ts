import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let component: SkeletonComponent;
  let fixture: ComponentFixture<SkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default width of w-full', () => {
    expect(component.width()).toBe('w-full');
  });

  it('should have default height of h-4', () => {
    expect(component.height()).toBe('h-4');
  });

  it('should have default rounded of md', () => {
    expect(component.rounded()).toBe('md');
  });

  it('should apply animate-pulse class', () => {
    const element = fixture.nativeElement.querySelector('div');
    expect(element.classList.contains('animate-pulse')).toBeTrue();
  });

  it('should apply custom width', () => {
    fixture.componentRef.setInput('width', 'w-24');
    fixture.detectChanges();
    expect(component.classes()).toContain('w-24');
  });

  it('should apply rounded-full for avatar style', () => {
    fixture.componentRef.setInput('rounded', 'full');
    fixture.detectChanges();
    expect(component.classes()).toContain('rounded-full');
  });

  it('should apply rounded-lg for md rounded', () => {
    expect(component.classes()).toContain('rounded-lg');
  });

  it('should apply custom class', () => {
    fixture.componentRef.setInput('class', 'bg-white/20');
    fixture.detectChanges();
    expect(component.classes()).toContain('bg-white/20');
  });
});
