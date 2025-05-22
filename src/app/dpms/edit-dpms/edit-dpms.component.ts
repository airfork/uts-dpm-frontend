import {
  AfterViewInit,
  Component,
  effect,
  HostListener,
  input,
  model,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DPMGroup } from '../../models/dpm-type';
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from 'primeng/textarea';
import { FormatService } from '../../services/format.service';
import { NgClass, NgIf } from '@angular/common';

interface DraggableDPMGroup {
  id: string;
  name: string;
  dpms: DraggableDPM[];
}

interface DraggableDPM {
  id: string;
  name: string;
  points: number;
}

@Component({
  selector: 'app-edit-dpms',
  templateUrl: './edit-dpms.component.html',
  styleUrl: './edit-dpms.component.css',
  imports: [FormsModule, CdkDropList, CdkDrag, CdkDropListGroup, Textarea, NgIf, NgClass],
})
export class EditDpmsComponent implements AfterViewInit {
  dpmGroupsNeedRefresh = model.required<boolean>();
  dpmGroups = input.required<DPMGroup[]>();
  _dpmGroups = signal<DraggableDPMGroup[]>([]);

  @ViewChildren('autoResizeTextarea') textareaDirectives?: QueryList<Textarea>;

  constructor(private formatService: FormatService) {
    effect(() => {
      const draggableGroups = this.dpmGroups().map((group) => {
        return {
          id: uuidv4(),
          name: group.groupName,
          dpms: group.dpms.map((dpm) => {
            return {
              id: uuidv4(),
              name: dpm.name,
              points: dpm.points,
            };
          }),
        };
      });

      this._dpmGroups.set(draggableGroups);
    });
  }

  ngAfterViewInit() {
    // Trigger resize for all textareas after the view is initialized.
    // A small timeout can help ensure styles are applied and dimensions are correct.
    setTimeout(() => this.triggerAllTextareasResize(), 0); // Initial resize
    this.textareaDirectives?.changes.subscribe(() => {
      // Handle new textareas, perhaps resize them too
      setTimeout(() => this.triggerAllTextareasResize(), 0);
    });
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.triggerAllTextareasResize();
  }

  dropGroups(event: CdkDragDrop<DPMGroup[]>) {
    moveItemInArray(this._dpmGroups(), event.previousIndex, event.currentIndex);
  }

  dropDpms(event: CdkDragDrop<DraggableDPM[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  addGroup() {
    this._dpmGroups.set([
      {
        dpms: [],
        id: uuidv4(),
        name: 'Sample Group',
      },
      ...this._dpmGroups(),
    ]);
  }

  addDpmToGroup(group: DraggableDPMGroup) {
    group.dpms = [
      {
        id: uuidv4(),
        name: '',
        points: 1,
      },
      ...group.dpms,
    ];
  }

  removeGroup(group: DraggableDPMGroup) {
    this._dpmGroups.set(this._dpmGroups().filter((g) => g.id !== group.id));
  }

  removeDpmFromGroup(group: DraggableDPMGroup, dpm: DraggableDPM) {
    group.dpms = group.dpms.filter((d) => d.id !== dpm.id);
  }

  get format() {
    return this.formatService;
  }

  private triggerAllTextareasResize() {
    if (this.textareaDirectives) {
      this.textareaDirectives.forEach((directive) => {
        // Check if the directive's element is visible before resizing
        if (directive && directive.el && directive.el.nativeElement) {
          if (directive.el.nativeElement.offsetParent !== null) {
            console.log('resizing');
            directive.resize();
          }
        }
      });
    }
  }
}
