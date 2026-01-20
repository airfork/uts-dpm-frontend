import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UpperCasePipe } from '@angular/common';
import { DpmService } from '../../services/dpm.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { StatCardComponent } from '../../ui/stat-card/stat-card.component';
import { PointsPipe } from '../../shared/pipes/PointsPipe';
import { BlockPipe } from '../../shared/pipes/BlockPipe';
import { DataTableComponent } from '../../ui/data-table/data-table.component';
import { TableColumn } from '../../ui/data-table/data-table.types';
import HomeDpmDto from '../../models/home-dpm-dto';
import { EmptyStateComponent } from '../../ui/empty-state/empty-state.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    LoadingComponent,
    StatCardComponent,
    PointsPipe,
    BlockPipe,
    UpperCasePipe,
    DataTableComponent,
    EmptyStateComponent,
  ],
})
export class HomeComponent {
  private dpmService = inject(DpmService);

  currentDpms = toSignal(this.dpmService.getCurrentDpms(), {
    initialValue: [],
  });
  expandedDpm = signal<HomeDpmDto | null>(null);
  private _isInitialLoad = signal(true);

  columns: TableColumn<HomeDpmDto>[] = [
    { field: 'type', header: 'Type', headerClass: 'w-[60%]' },
    { field: 'points', header: 'Points', headerClass: 'w-[15%]' },
    { field: 'date', header: 'Date', headerClass: 'w-[25%]' },
  ];

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

  isExpanded(dpm: HomeDpmDto): boolean {
    return this.expandedDpm() === dpm;
  }

  toggleExpand(dpm: HomeDpmDto): void {
    if (this.expandedDpm() === dpm) {
      this.expandedDpm.set(null);
    } else {
      this.expandedDpm.set(dpm);
    }
    // After first interaction, disable initial load animations
    this._isInitialLoad.set(false);
  }

  isInitialLoad(): boolean {
    return this._isInitialLoad();
  }
}
