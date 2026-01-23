import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';

import { EditDpmsComponent } from './edit-dpms.component';
import { DPMGroup } from '../../models/dpm-type';

describe('EditDpmsComponent', () => {
  let component: EditDpmsComponent;
  let fixture: ComponentFixture<EditDpmsComponent>;

  const mockDpmGroups: DPMGroup[] = [
    {
      id: 'group-1',
      groupName: 'Test Group',
      dpms: [
        { id: 1, name: 'Positive DPM', points: 5 },
        { id: 2, name: 'Negative DPM', points: -3 },
        { id: 3, name: 'Zero DPM', points: 0 },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDpmsComponent],
      providers: [provideToastr(), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(EditDpmsComponent);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('dpmGroupsInput', mockDpmGroups);
    fixture.componentRef.setInput('dpmGroupsNeedRefresh', signal(false));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with DPM groups', () => {
      fixture.detectChanges();
      expect(component.groupsFormArray.length).toBe(1);
    });

    it('should initialize DPMs within groups', () => {
      fixture.detectChanges();
      const groupControl = component.groupsFormArray.at(0);
      const dpmsArray = component.getDpmsFormArray(groupControl);
      expect(dpmsArray.length).toBe(3);
    });
  });

  describe('Error Count Methods', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should count errors correctly for valid group', () => {
      const groupControl = component.groupsFormArray.at(0);
      const errorCount = component.getGroupErrorCount(groupControl);
      expect(errorCount).toBe(0);
    });

    it('should count errors when DPM name is empty and touched', () => {
      const groupControl = component.groupsFormArray.at(0);
      const dpmsArray = component.getDpmsFormArray(groupControl);
      const nameControl = dpmsArray.at(0).get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();

      const errorCount = component.getGroupErrorCount(groupControl);
      expect(errorCount).toBeGreaterThan(0);
    });

    it('should detect duplicate DPM names', () => {
      const groupControl = component.groupsFormArray.at(0);
      const dpmsArray = component.getDpmsFormArray(groupControl);
      dpmsArray.at(0).get('name')?.setValue('Duplicate Name');
      dpmsArray.at(1).get('name')?.setValue('Duplicate Name');

      const isDuplicated = component.dpmNameIsDuplicated(groupControl, dpmsArray.at(1));
      expect(isDuplicated).toBe(true);
    });
  });

  describe('Color Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should track used color IDs', () => {
      const groupControl = component.groupsFormArray.at(0);
      const dpmsArray = component.getDpmsFormArray(groupControl);

      // Set a color on first DPM
      dpmsArray.at(0).get('color')?.setValue({ colorId: 1, hexCode: '#FF0000' });

      const usedIds = component.getUsedColorIds('dpm-2');
      expect(usedIds).toContain(1);
    });

    it('should not include current DPM color in used list', () => {
      const groupControl = component.groupsFormArray.at(0);
      const dpmsArray = component.getDpmsFormArray(groupControl);

      // Set color on first DPM
      const dpmControl = dpmsArray.at(0);
      dpmControl.get('color')?.setValue({ colorId: 1, hexCode: '#FF0000' });

      const dpmId = dpmControl.value.id;
      const usedIds = component.getUsedColorIds(dpmId);
      expect(usedIds).not.toContain(1);
    });
  });

  describe('Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should detect when form has non-form-group errors (duplicate names)', () => {
      const groupControl = component.groupsFormArray.at(0);
      const dpmsArray = component.getDpmsFormArray(groupControl);
      dpmsArray.at(0).get('name')?.setValue('Same Name');
      dpmsArray.at(1).get('name')?.setValue('Same Name');

      expect(component.formHasNonFormGroupErrors()).toBe(true);
    });

    it('should return false for non-form-group errors when names are unique', () => {
      expect(component.formHasNonFormGroupErrors()).toBe(false);
    });
  });

  describe('Group Operations', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should add new group at the beginning', () => {
      const initialLength = component.groupsFormArray.length;
      component.addGroup();
      expect(component.groupsFormArray.length).toBe(initialLength + 1);
    });

    it('should add new DPM to group', () => {
      const groupControl = component.groupsFormArray.at(0);
      const initialLength = component.getDpmsFormArray(groupControl).length;

      component.addDpmToGroup(groupControl);

      const newLength = component.getDpmsFormArray(groupControl).length;
      expect(newLength).toBe(initialLength + 1);
    });
  });
});
