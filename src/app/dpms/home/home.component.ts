import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UpperCasePipe } from '@angular/common';
import { DpmService } from '../../services/dpm.service';
import { ModalComponent } from '../../ui/modal/modal.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { StatCardComponent } from '../../ui/stat-card/stat-card.component';
import { PointsPipe } from '../../shared/pipes/PointsPipe';
import { BlockPipe } from '../../shared/pipes/BlockPipe';
import { TableModule } from 'primeng/table';
import HomeDpmDto from '../../models/home-dpm-dto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    ModalComponent,
    LoadingComponent,
    StatCardComponent,
    PointsPipe,
    BlockPipe,
    UpperCasePipe,
    TableModule,
  ],
})
export class HomeComponent {
  private dpmService = inject(DpmService);

  currentDpms = toSignal(this.dpmService.getCurrentDpms(), {
    initialValue: [],
  });
  currentDpm = signal<HomeDpmDto | null>(null);
  isModalOpen = signal(false);

  totalCount = computed(() => this.currentDpms()?.length ?? 0);

  positivePoints = computed(() => {
    const dpms = this.currentDpms();
    if (!dpms) return 0;
    return dpms.filter((d) => d.points > 0).reduce((sum, d) => sum + d.points, 0);
  });

  negativePoints = computed(() => {
    const dpms = this.currentDpms();
    if (!dpms) return 0;
    return dpms.filter((d) => d.points < 0).reduce((sum, d) => sum + d.points, 0);
  });

  clickRow(dpm: HomeDpmDto) {
    this.currentDpm.set(dpm);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
