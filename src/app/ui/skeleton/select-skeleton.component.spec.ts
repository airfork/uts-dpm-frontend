import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectSkeletonComponent } from './select-skeleton.component';

describe('SelectSkeletonComponent', () => {
  let component: SelectSkeletonComponent;
  let fixture: ComponentFixture<SelectSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show label by default', () => {
    expect(component.showLabel()).toBeTrue();
  });

  it('should render label skeleton when showLabel is true', () => {
    const skeletons = fixture.nativeElement.querySelectorAll('app-skeleton');
    expect(skeletons.length).toBeGreaterThanOrEqual(2);
  });

  it('should hide label skeleton when showLabel is false', () => {
    fixture.componentRef.setInput('showLabel', false);
    fixture.detectChanges();
    const skeletons = fixture.nativeElement.querySelectorAll('app-skeleton');
    expect(skeletons.length).toBe(2);
  });

  it('should have proper height for select skeleton', () => {
    const selectSkeleton = fixture.nativeElement.querySelector('app-skeleton[height="h-[42px]"]');
    expect(selectSkeleton).toBeTruthy();
  });
});
