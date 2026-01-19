import { Component, effect, inject, input, model, OnInit, signal } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DPMGroup, DPMType } from '../../models/dpm-type';
import { v4 as uuidv4 } from 'uuid';
import { NgClass } from '@angular/common';
import { AutoResizeDirective } from '../../shared/directives/auto-resize.directive';
import { CollapsibleComponent } from '../../ui/collapsible/collapsible.component';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { PutDpmGroup, PutDpmType } from '../../models/put-dpm-groups';
import { DpmService } from '../../services/dpm.service';
import { finalize } from 'rxjs';
import { GetDpmColors } from '../../models/get-dpm-colors';
import { ConfirmBoxComponent } from '../../ui/confirm-box/confirm-box.component';
import { CardComponent } from '../../ui/card/card.component';
import { ModalComponent } from '../../ui/modal/modal.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { PageHeaderComponent } from '../../ui/page-header/page-header.component';
import { PointsDisplayPipe } from '../../shared/pipes/points-display.pipe';
import { ColorByIdPipe } from '../../shared/pipes/color-by-id.pipe';
import { ColorDropdownComponent } from './color-dropdown/color-dropdown.component';

interface DpmListDropData {
  groupControl: AbstractControl; // This is the FormGroup for the DPM group
  controls: AbstractControl[]; // This is the array of FormControls/FormGroups for the DPMs themselves
}

interface DpmTypeFormValue {
  id: string; // From uuidv4() or existing dpm.id
  name: string | null; // Can be null for new items or if not required initially
  points: number | null; // Can be null or have a default, subject to validators
  color: {
    colorId: number;
    hexCode: string;
  } | null;
}

interface DpmGroupFormValue {
  id: string; // From uuidv4() or existing group.id
  name: string | null; // Corresponds to groupName, can be null for new groups
  dpms: DpmTypeFormValue[];
}

const DPM_POINTS_VALIDATORS = [Validators.required, Validators.min(-100), Validators.max(100)];
const DPM_NAME_VALIDATORS = [Validators.required, Validators.maxLength(255)];
const DPM_GROUP_NAME_VALIDATORS = [Validators.required, Validators.maxLength(500)];

@Component({
  selector: 'app-edit-dpms',
  templateUrl: './edit-dpms.component.html',
  styleUrl: './edit-dpms.component.css',
  imports: [
    FormsModule,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    NgClass,
    ReactiveFormsModule,
    ConfirmBoxComponent,
    CardComponent,
    ModalComponent,
    ButtonComponent,
    AutoResizeDirective,
    CollapsibleComponent,
    TooltipDirective,
    PageHeaderComponent,
    PointsDisplayPipe,
    ColorByIdPipe,
    ColorDropdownComponent,
  ],
})
export class EditDpmsComponent implements OnInit {
  private notificationService = inject(NotificationService);
  private dpmService = inject(DpmService);

  dpmGroupsNeedRefresh = model.required<boolean>();
  dpmGroupsInput = input.required<DPMGroup[]>();
  isSaving = signal(false);
  dpmColors = signal<GetDpmColors[]>([]);
  currentModalDpm = signal<DpmTypeFormValue | null>(null);

  confirmModalOpen = signal(false);
  confirmModalMessage = signal('');
  confirmModalCallback = signal<() => void>(() => {});
  isColorModalOpen = signal(false);

  dpmEditForm!: FormGroup; // Main form group
  colorSelectionForm!: FormGroup;

  private fb = inject(FormBuilder);

  constructor() {
    effect(() => {
      this.initializeForm(this.dpmGroupsInput());
    });
  }

  ngOnInit() {
    this.dpmService.getDpmColors().subscribe((colors) => {
      this.dpmColors.set(colors);
    });

    this.initializeColorSelectionModal();

    // Initialize form structure, possibly with empty array if input not ready
    this.dpmEditForm = this.fb.group({
      groups: this.fb.array([]),
    });
  }

  confirmReset() {
    this.confirmModalOpen.set(true);
    this.confirmModalMessage.set(
      'This will reset the form to its initial state and any changes will be lost.'
    );
    this.confirmModalCallback.set(() => this.reset());
  }

  reset() {
    this.initializeForm(this.dpmGroupsInput());
  }

  initializeForm(groupsData: DPMGroup[]) {
    const groupsFormArray = this.fb.array(
      groupsData.map((group) => this.createDpmGroupFormGroup(group))
    );

    this.dpmEditForm.setControl('groups', groupsFormArray);
    this.dpmEditForm.markAsPristine();
  }

  createDpmGroupFormGroup(group: DPMGroup): FormGroup {
    return this.fb.group({
      id: [group.id || uuidv4()], // Assuming DPMGroup might have an id
      name: [group.groupName, DPM_GROUP_NAME_VALIDATORS],
      dpms: this.fb.array(group.dpms.map((dpm) => this.createDpmItemFormGroup(dpm))),
    });
  }

  createDpmItemFormGroup(dpm: DPMType): FormGroup {
    return this.fb.group({
      id: [dpm.id || uuidv4()], // Assuming DPMType might have an id
      name: [dpm.name, DPM_NAME_VALIDATORS],
      points: [dpm.points, DPM_POINTS_VALIDATORS],
      color: [dpm.dpmColor],
    });
  }

  get groupsFormArray(): FormArray {
    return this.dpmEditForm.get('groups') as FormArray;
  }

  getDpmsFormArray(groupControl: AbstractControl): FormArray {
    return groupControl.get('dpms') as FormArray;
  }

  // --- Methods to modify form ---
  addGroup() {
    const newGroup = this.fb.group({
      id: [uuidv4()],
      name: [null, DPM_GROUP_NAME_VALIDATORS],
      dpms: this.fb.array([]),
    });
    this.groupsFormArray.insert(0, newGroup);
  }

  addDpmToGroup(groupControl: AbstractControl) {
    const dpmsArray = this.getDpmsFormArray(groupControl);
    const newDpm = this.fb.group({
      id: [uuidv4()],
      name: [null, DPM_NAME_VALIDATORS],
      points: [1, DPM_POINTS_VALIDATORS],
      color: [null],
    });
    dpmsArray.push(newDpm);
  }

  confirmRemoveGroup(groupIndex: number) {
    this.confirmModalOpen.set(true);
    this.confirmModalMessage.set('This will remove the group (changes still need to be saved).');
    this.confirmModalCallback.set(() => this.removeGroup(groupIndex));
  }

  removeGroup(groupIndex: number) {
    this.groupsFormArray.removeAt(groupIndex);
    this.dpmEditForm.markAsDirty();
  }

  confirmRemoveDpmFromGroup(groupControl: AbstractControl, dpmIndex: number) {
    this.confirmModalOpen.set(true);
    this.confirmModalMessage.set(
      'This will remove the DPM from the group (changes still need to be saved).'
    );
    this.confirmModalCallback.set(() => this.removeDpmFromGroup(groupControl, dpmIndex));
  }

  removeDpmFromGroup(groupControl: AbstractControl, dpmIndex: number) {
    const dpmsArray = this.getDpmsFormArray(groupControl);
    dpmsArray.removeAt(dpmIndex);
    this.dpmEditForm.markAsDirty();
  }

  // --- Drag and Drop ---
  dropGroups(event: CdkDragDrop<AbstractControl[]>) {
    if (event.previousIndex == event.currentIndex) return;

    moveItemInArray(this.groupsFormArray.controls, event.previousIndex, event.currentIndex);
    this.groupsFormArray.updateValueAndValidity();
    this.groupsFormArray.markAsDirty();
  }

  dropDpms(event: CdkDragDrop<DpmListDropData>, targetGroupControl: AbstractControl) {
    if (event.previousIndex == event.currentIndex) return;
    const targetDpmsArray = this.getDpmsFormArray(targetGroupControl);
    targetDpmsArray.markAsDirty();

    if (event.previousContainer === event.container) {
      moveItemInArray(targetDpmsArray.controls, event.previousIndex, event.currentIndex);
      targetDpmsArray.updateValueAndValidity();
    } else {
      // Type assertion for clarity and safety, assuming DpmListDropData is correct for your cdkDropListData
      const sourceContainerData = event.previousContainer.data as DpmListDropData;
      if (!sourceContainerData || !sourceContainerData.groupControl) {
        console.error(
          'Source container data or groupControl is missing!',
          event.previousContainer.data
        );
        return;
      }

      const sourceGroupControl = sourceContainerData.groupControl;
      const sourceDpmsArray = this.getDpmsFormArray(sourceGroupControl);

      const itemToMove = sourceDpmsArray.at(event.previousIndex);

      if (itemToMove) {
        sourceDpmsArray.removeAt(event.previousIndex);
        targetDpmsArray.insert(event.currentIndex, itemToMove);

        // Crucial: Update validity and trigger change detection for both FormArrays
        sourceDpmsArray.updateValueAndValidity();
        targetDpmsArray.updateValueAndValidity();
      } else {
        console.error('Could not find DPM to move in source array at index:', event.previousIndex);
      }
    }

    this.dpmEditForm.updateValueAndValidity();
  }

  // -- Form control helpers --
  dpmsInGroupHaveErrors(groupControl: AbstractControl): boolean {
    const dpmsArray = this.getDpmsFormArray(groupControl);
    if (!dpmsArray || dpmsArray.length === 0) {
      return false; // No DPMs, so no DPM errors in this group
    }

    return dpmsArray.controls.some((dpmControl) => dpmControl.invalid);
  }

  groupNameHasErrors(groupControl: AbstractControl): boolean {
    return this.controlHasErrors(groupControl.get('name'));
  }

  groupHasErrors(groupControl: AbstractControl): boolean {
    const dpmsArray = this.getDpmsFormArray(groupControl);
    return (
      this.groupNameHasErrors(groupControl) ||
      !dpmsArray ||
      dpmsArray.length == 0 ||
      this.dpmsInGroupHaveErrors(groupControl) ||
      this.groupNameIsDuplicated(groupControl)
    );
  }

  getGroupErrorMessages(groupControl: AbstractControl): string[] {
    const nameControl = groupControl.get('name');
    const dpmsArray = this.getDpmsFormArray(groupControl);

    const errors: string[] = [];
    if (nameControl?.errors?.['required']) {
      errors.push('Group name is required.');
    }

    if (nameControl?.errors?.['maxlength']) {
      errors.push('Group name cannot be longer than 500 characters.');
    }

    if (!dpmsArray || dpmsArray.length === 0) {
      errors.push('Group must have at least one DPM.');
    }

    if (this.groupNameIsDuplicated(groupControl)) {
      errors.push('Group name must be unique.');
    }

    return errors;
  }

  getGroupErrorCount(groupControl: AbstractControl): number {
    let count = 0;

    // Count group-level errors
    if (this.groupNameHasErrors(groupControl)) count++;
    if (this.groupNameIsDuplicated(groupControl)) count++;

    const dpmsArray = this.getDpmsFormArray(groupControl);
    if (!dpmsArray || dpmsArray.length === 0) count++;

    // Count DPM-level errors
    dpmsArray.controls.forEach((dpmControl) => {
      if (this.dpmHasErrors(dpmControl, 'name')) count++;
      if (this.dpmHasErrors(dpmControl, 'points')) count++;
      if (this.dpmNameIsDuplicated(groupControl, dpmControl)) count++;
    });

    return count;
  }

  getDpmFormControl(dpmControl: AbstractControl, controlName: string): AbstractControl | null {
    return dpmControl.get(controlName);
  }

  dpmHasErrors(dpmControl: AbstractControl, controlName: string): boolean {
    const control = this.getDpmFormControl(dpmControl, controlName);
    return this.controlHasErrors(control);
  }

  dpmNameIsDuplicated(groupControl: AbstractControl, dpmControl: AbstractControl): boolean {
    const nameControl = dpmControl.get('name');
    if (!nameControl) return false;

    const dpmName = nameControl.value as string;
    const dpmsArray = this.getDpmsFormArray(groupControl);
    return dpmsArray.controls.some((dpm) => {
      const dpmFormGroup = dpm as FormGroup;
      const dpmValue = dpmFormGroup.value as DpmTypeFormValue;
      return this.normalizeStringEquals(dpmValue.name, dpmName) && dpmFormGroup !== dpmControl;
    });
  }

  getDpmErrorMessages(groupControl: AbstractControl, dpmControl: AbstractControl): string[] {
    const nameControl = this.getDpmFormControl(dpmControl, 'name');
    const pointsControl = this.getDpmFormControl(dpmControl, 'points');

    const errors: string[] = [];
    if (nameControl?.errors?.['required']) {
      errors.push('DPM name is required.');
    }

    if (nameControl?.errors?.['maxlength']) {
      errors.push('DPM name cannot be longer than 255 characters.');
    }

    if (pointsControl?.errors?.['required']) {
      errors.push('DPM points are required.');
    }

    if (pointsControl?.errors?.['min'] || pointsControl?.errors?.['max']) {
      errors.push('DPM points must be between -100 and 100 (inclusive).');
    }

    if (this.dpmNameIsDuplicated(groupControl, dpmControl)) {
      errors.push('DPM name must be unique.');
    }

    return errors;
  }

  formHasNonFormGroupErrors(): boolean {
    const groupsArray = this.groupsFormArray;

    for (const group of groupsArray.controls) {
      if (this.groupNameIsDuplicated(group)) return true;

      for (const dpm of this.getDpmsFormArray(group).controls) {
        if (this.dpmNameIsDuplicated(group, dpm)) return true;
      }
    }

    return false;
  }

  // -- Color dropdown helpers --
  getUsedColorIds(excludeDpmId: string): number[] {
    const usedIds: number[] = [];

    this.groupsFormArray.controls.forEach((groupControl) => {
      const dpmsArray = this.getDpmsFormArray(groupControl);
      dpmsArray.controls.forEach((dpmControl) => {
        const dpmValue = dpmControl.value;
        if (dpmValue.id !== excludeDpmId && dpmValue.color?.colorId) {
          usedIds.push(dpmValue.color.colorId);
        }
      });
    });

    return usedIds;
  }

  onColorSelected(dpmControl: AbstractControl, color: GetDpmColors | null) {
    const colorValue = color ? { colorId: color.colorId, hexCode: color.hexCode } : null;
    (dpmControl as FormGroup).get('color')?.setValue(colorValue);
    dpmControl.markAsDirty();
    this.dpmEditForm.markAsDirty();
  }

  // -- Modal functions --

  get selectedColor(): string {
    const currentDpm = this.currentModalDpm();
    if (!this.colorSelectionForm || !currentDpm) return '';

    const selectedValue = this.colorSelectionForm.value.selectedColor as GetDpmColors;
    return selectedValue ? selectedValue.colorName : '';
  }

  showColorModal(dpmControl: AbstractControl) {
    const controlData = dpmControl.value as DpmTypeFormValue;
    this.currentModalDpm.set(controlData);

    const currentColor = this.dpmColors().find(
      (color) => color.colorId === controlData.color?.colorId
    );

    this.initializeColorSelectionModal(currentColor);
    this.isColorModalOpen.set(true);
  }

  closeColorModal() {
    this.isColorModalOpen.set(false);
  }

  initializeColorSelectionModal(selectedColor: GetDpmColors | null | undefined = null) {
    this.colorSelectionForm = this.fb.group({
      selectedColor: selectedColor,
    });
  }

  selectedColorIsInUse(): boolean {
    const currentDpm = this.currentModalDpm();
    if (!this.colorSelectionForm || !currentDpm) return false;

    const selectedValue = this.colorSelectionForm.value.selectedColor as GetDpmColors;
    if (selectedValue == null) return false;

    const groups = this.groupsFormArray.controls;
    for (const groupControl of groups) {
      const dpmsArray = this.getDpmsFormArray(groupControl);
      const dpmsContainColor = dpmsArray.controls.some((dc) => {
        const dpmFormGroup = dc as FormGroup;
        const dpmValue = dpmFormGroup.value as DpmTypeFormValue;
        return dpmValue.color?.colorId === selectedValue?.colorId && dpmValue.id !== currentDpm.id;
      });

      if (dpmsContainColor) return true;
    }

    return false;
  }

  applyColorSelection() {
    const currentDpm = this.currentModalDpm();
    if (!this.colorSelectionForm || !this.colorSelectionForm.valid || !currentDpm) return;

    const selectedValue = this.colorSelectionForm.value.selectedColor as GetDpmColors;
    const groups = this.groupsFormArray.controls;
    for (const groupControl of groups) {
      const dpmsArray = this.getDpmsFormArray(groupControl);
      const targetDpmControl = dpmsArray.controls.find((dc) => dc.value.id === currentDpm.id);

      if (targetDpmControl) {
        (targetDpmControl as FormGroup).get('color')?.setValue(
          selectedValue
            ? {
                colorId: selectedValue.colorId,
                hexCode: selectedValue.hexCode,
              }
            : null
        );
        targetDpmControl.markAsDirty(); // Mark the main form control as dirty
        this.dpmEditForm.markAsDirty();
        break;
      }
    }

    this.closeColorModal();
  }

  // Save updates
  save() {
    this.isSaving.set(true);

    if (!this.dpmEditForm.valid) {
      console.error('Trying to save but form is invalid!');
      this.notificationService.showError('Something went wrong, please try again.', 'Error');
      this.isSaving.set(false);
      return;
    }

    const requestData: PutDpmGroup[] = [];
    const groupsFormArray = this.groupsFormArray;

    groupsFormArray.controls.forEach((groupControl) => {
      const groupFormGroup = groupControl as FormGroup;
      const groupValue = groupFormGroup.value as DpmGroupFormValue;
      const groupDpms: PutDpmType[] = [];

      requestData.push({
        groupName: groupValue.name!.trim(),
        dpms: groupDpms,
      });
      const dpmsArray = this.getDpmsFormArray(groupFormGroup);

      dpmsArray.controls.forEach((dpmControl: AbstractControl) => {
        // Each control in dpmsArray is a FormGroup representing a DPM item.
        const dpmFormGroup = dpmControl as FormGroup;

        // Access the typed value of the current DPM item.
        // The structure of dpmFormGroup.value is expected to match DpmItemFormValue.
        const dpmValue = dpmFormGroup.value as DpmTypeFormValue;

        groupDpms.push({
          dpmType: dpmValue.name!.trim(),
          points: dpmValue.points!,
          colorId: dpmValue.color?.colorId,
        });
      });
    });

    this.dpmService
      .updateDpmGroups(requestData)
      .pipe(
        finalize(() => {
          this.isSaving.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('DPMs updated successfully', 'Success');
          this.dpmGroupsNeedRefresh.set(true);
          this.dpmEditForm.markAsPristine();
        },
        error: (err) => {
          console.error('Error updating DPMs:', err);
        },
      });
  }

  private controlHasErrors(control: AbstractControl | null): boolean {
    if (!control) return false;
    return control.invalid;
  }

  private groupNameIsDuplicated(groupControl: AbstractControl): boolean {
    const nameControl = groupControl.get('name');
    if (!nameControl) return false;

    const groupName = nameControl.value as string;
    const groupsArray = this.groupsFormArray;
    return groupsArray.controls.some((group) => {
      const groupFormGroup = group as FormGroup;
      const groupValue = groupFormGroup.value as DpmGroupFormValue;
      return (
        this.normalizeStringEquals(groupValue.name, groupName) && groupFormGroup !== groupControl
      );
    });
  }

  private normalizeStringEquals(s1: string | null, s2: string | null): boolean {
    if (!s1 || !s2) return false;
    return s1.trim().toLowerCase() === s2.trim().toLowerCase();
  }
}
