import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { EditDpmsComponent } from './edit-dpms.component';

describe('EditDpmsComponent', () => {
  let component: EditDpmsComponent;
  let fixture: ComponentFixture<EditDpmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDpmsComponent],
      providers: [provideToastr(), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(EditDpmsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
