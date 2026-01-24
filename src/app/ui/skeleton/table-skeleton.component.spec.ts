import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableSkeletonComponent } from './table-skeleton.component';

describe('TableSkeletonComponent', () => {
  let component: TableSkeletonComponent;
  let fixture: ComponentFixture<TableSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default 5 rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(5);
  });

  it('should render default 3 columns', () => {
    const firstRowCells = fixture.nativeElement.querySelectorAll('tbody tr:first-child td');
    expect(firstRowCells.length).toBe(3);
  });

  it('should show header by default', () => {
    const header = fixture.nativeElement.querySelector('thead');
    expect(header).toBeTruthy();
  });

  it('should hide header when showHeader is false', () => {
    fixture.componentRef.setInput('showHeader', false);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('thead');
    expect(header).toBeFalsy();
  });

  it('should render custom row count', () => {
    fixture.componentRef.setInput('rows', 10);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(10);
  });

  it('should render custom column count', () => {
    fixture.componentRef.setInput('columns', 5);
    fixture.detectChanges();
    const firstRowCells = fixture.nativeElement.querySelectorAll('tbody tr:first-child td');
    expect(firstRowCells.length).toBe(5);
  });

  it('should show avatar skeleton when showAvatar is true', () => {
    fixture.componentRef.setInput('showAvatar', true);
    fixture.detectChanges();
    const avatarContainer = fixture.nativeElement.querySelector(
      'tbody tr:first-child td:first-child .flex.items-center.gap-3'
    );
    expect(avatarContainer).toBeTruthy();
  });
});
