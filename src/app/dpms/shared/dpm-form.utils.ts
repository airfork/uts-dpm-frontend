import { FormGroup } from '@angular/forms';
import { DPMGroup } from '../../models/dpm-type';

export function setDefaultDpmType(
  dpmGroups: DPMGroup[],
  formGroup: FormGroup,
  controlName: string = 'type'
): void {
  if (dpmGroups.length > 0 && dpmGroups[0].dpms.length > 0) {
    const firstDpm = dpmGroups[0].dpms[0];
    formGroup.get(controlName)?.setValue(firstDpm.id);
    formGroup.updateValueAndValidity();
  } else {
    console.warn('No DPM groups or types found to set as default');
  }
}
