import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, signal, viewChild } from '@angular/core';
import { ConfirmBoxComponent } from './confirm-box.component';

// Test host to provide required model input
@Component({
  template: `
    <app-confirm-box
      [(isOpen)]="isOpen"
      [message]="message"
      [title]="title"
      [confirmText]="confirmText"
      [outputKey]="outputKey"
      [onConfirm]="onConfirmFn"
      (confirmed)="onConfirmed($event)"
    />
  `,
  imports: [ConfirmBoxComponent],
})
class TestHostComponent {
  isOpen = signal(false);
  message = 'Are you sure you want to delete this item?';
  title = 'Confirm Delete';
  confirmText = 'DELETE';
  outputKey = 'item-123';
  onConfirmFn?: () => void;

  confirmBox = viewChild.required(ConfirmBoxComponent);

  confirmedValue: string | null = null;
  onConfirmed(value: string) {
    this.confirmedValue = value;
  }
}

describe('ConfirmBoxComponent', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let component: ConfirmBoxComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
    component = hostComponent.confirmBox();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should have isOpen model', () => {
      expect(component.isOpen()).toBe(false);
    });

    it('should have message input', () => {
      expect(component.message()).toBe('Are you sure you want to delete this item?');
    });

    it('should have title input', () => {
      expect(component.title()).toBe('Confirm Delete');
    });

    it('should have confirmText input', () => {
      expect(component.confirmText()).toBe('DELETE');
    });

    it('should have outputKey input', () => {
      expect(component.outputKey()).toBe('item-123');
    });
  });

  describe('default values', () => {
    it('should have default title when not provided', async () => {
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [ConfirmBoxComponent],
      }).compileComponents();

      const directFixture = TestBed.createComponent(ConfirmBoxComponent);
      directFixture.componentRef.setInput('isOpen', false);
      directFixture.componentRef.setInput('message', 'Test message');
      directFixture.detectChanges();

      expect(directFixture.componentInstance.title()).toBe('Are you sure?');
    });
  });

  describe('confirm method', () => {
    it('should emit confirmed event with outputKey', fakeAsync(() => {
      hostComponent.isOpen.set(true);
      fixture.detectChanges();

      component.confirm();
      tick();

      expect(hostComponent.confirmedValue).toBe('item-123');
    }));

    it('should close the dialog', fakeAsync(() => {
      hostComponent.isOpen.set(true);
      fixture.detectChanges();

      component.confirm();
      tick();

      expect(component.isOpen()).toBe(false);
    }));

    it('should call onConfirm callback if provided', fakeAsync(() => {
      const onConfirmSpy = jasmine.createSpy('onConfirm');
      hostComponent.onConfirmFn = onConfirmSpy;
      hostComponent.isOpen.set(true);
      fixture.detectChanges();

      component.confirm();
      tick();

      expect(onConfirmSpy).toHaveBeenCalled();
    }));

    it('should not throw if onConfirm is not provided', fakeAsync(() => {
      hostComponent.onConfirmFn = undefined;
      hostComponent.isOpen.set(true);
      fixture.detectChanges();

      expect(() => {
        component.confirm();
        tick();
      }).not.toThrow();
    }));
  });

  describe('requestClose method', () => {
    it('should close the dialog', () => {
      hostComponent.isOpen.set(true);
      fixture.detectChanges();

      component.requestClose();

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('isOpen model binding', () => {
    it('should sync with host component', () => {
      hostComponent.isOpen.set(true);
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      hostComponent.isOpen.set(false);
      fixture.detectChanges();
      expect(component.isOpen()).toBe(false);
    });
  });
});
