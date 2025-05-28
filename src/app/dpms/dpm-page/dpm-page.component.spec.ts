import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpmPageComponent } from './dpm-page.component';

describe('DpmPageComponent', () => {
  let component: DpmPageComponent;
  let fixture: ComponentFixture<DpmPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DpmPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DpmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
