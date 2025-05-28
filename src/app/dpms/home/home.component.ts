import { ChangeDetectionStrategy, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { DpmService } from '../../services/dpm.service';
import { FormatService } from '../../services/format.service';
import HomeDpmDto from '../../models/home-dpm-dto';
import { toSignal } from '@angular/core/rxjs-interop';
import { PointsPipe } from '../../shared/pipes/PointsPipe';
import { BlockPipe } from '../../shared/pipes/BlockPipe';
import { UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PointsPipe, BlockPipe, UpperCasePipe, FormsModule, LoadingComponent, TableModule],
})
export class HomeComponent {
  currentDpms = toSignal(this.dpmService.getCurrentDpms(), {
    initialValue: [],
  });
  currentDpm = signal<HomeDpmDto | null>(null);
  @ViewChild('dpmModal') dpmModalElement!: ElementRef<HTMLDialogElement>;

  constructor(
    private dpmService: DpmService,
    private formatService: FormatService
  ) {}

  clickRow(dpm: HomeDpmDto) {
    this.currentDpm.set(dpm);
    this.showModalInternal();
  }

  get format() {
    return this.formatService;
  }

  showModalInternal() {
    if (this.dpmModalElement && this.dpmModalElement.nativeElement) {
      this.dpmModalElement.nativeElement.showModal();
    }
  }
}
