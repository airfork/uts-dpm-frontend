import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDpmsComponent } from './edit-dpms.component';

describe('EditDpmsComponent', () => {
  let component: EditDpmsComponent;
  let fixture: ComponentFixture<EditDpmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDpmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDpmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
