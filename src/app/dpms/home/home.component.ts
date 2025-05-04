import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DpmService } from '../../services/dpm.service';
import { FormatService } from '../../services/format.service';
import HomeDpmDto from '../../models/home-dpm-dto';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class HomeComponent {
  currentDpms = toSignal(this.dpmService.getCurrentDpms(), { initialValue: [] });
  modalOpen = signal(false);
  currentDpm = signal<HomeDpmDto | null>(null);

  constructor(
    private dpmService: DpmService,
    private formatService: FormatService
  ) {}

  clickRow(dpm: HomeDpmDto) {
    this.modalOpen.set(true);
    this.currentDpm.set(dpm);
  }

  get format() {
    return this.formatService;
  }
}
