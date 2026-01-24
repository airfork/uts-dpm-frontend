import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardSkeletonComponent } from './card-skeleton.component';

describe('CardSkeletonComponent', () => {
  let component: CardSkeletonComponent;
  let fixture: ComponentFixture<CardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default 5 cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.space-y-3 > div');
    expect(cards.length).toBe(5);
  });

  it('should render custom card count', () => {
    fixture.componentRef.setInput('count', 3);
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.space-y-3 > div');
    expect(cards.length).toBe(3);
  });

  it('should not show avatar by default', () => {
    expect(component.showAvatar()).toBeFalse();
  });

  it('should show avatar when showAvatar is true', () => {
    fixture.componentRef.setInput('showAvatar', true);
    fixture.detectChanges();
    const avatarSkeleton = fixture.nativeElement.querySelector('app-skeleton[rounded="full"]');
    expect(avatarSkeleton).toBeTruthy();
  });
});
