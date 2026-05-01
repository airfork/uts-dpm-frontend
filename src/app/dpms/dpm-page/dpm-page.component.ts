import { afterNextRender, Component, effect, OnInit, signal, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { DPMGroup } from '../../models/dpm-type';
import { setDefaultDpmType } from '../shared/dpm-form.utils';
import { DpmService } from '../../services/dpm.service';
import { first } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DpmTab } from '../../users/shared/tab.types';
import { Title } from '@angular/platform-browser';
import { GenerateTitle } from '../../shared/title-helper';
import { NewDpmComponent } from '../new-dpm/new-dpm.component';
import { EditDpmsComponent } from '../edit-dpms/edit-dpms.component';
import { PageHeaderComponent } from '../../ui/page-header/page-header.component';
import UsernameDto from '../../models/username-dto';
import { UserService } from '../../services/user.service';
import { AuthorizedDirective } from '../../auth/directives/authorized.directive';
import { Roles } from '../../auth/roles.types';
import { AuthService } from '../../services/auth.service';

const regex24HourTime = /^(?:[01][0-9]|2[0-3])[0-5][0-9](?::[0-5][0-9])?$/;
const editRoles: Roles[] = ['ADMIN'];

@Component({
  selector: 'app-dpm-page',
  imports: [NgClass, NewDpmComponent, EditDpmsComponent, AuthorizedDirective, PageHeaderComponent],
  templateUrl: './dpm-page.component.html',
  styleUrl: './dpm-page.component.css',
})
export class DpmPageComponent implements OnInit {
  private dpmService = inject(DpmService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);

  dpmGroups = signal<DPMGroup[]>([]);
  isGroupsLoaded = signal<boolean>(false);
  groupsNeedRefresh = signal(true);
  activeTab = signal({ new: true, edit: false });
  driverNames = signal<UsernameDto[]>([]);

  homeFormGroup = new FormGroup({
    dpmDate: new FormControl(new Date(), [Validators.required]),
    startTime: new FormControl('', [
      Validators.required,
      Validators.maxLength(4),
      Validators.minLength(4),
      Validators.pattern(regex24HourTime),
    ]),
    endTime: new FormControl('', [
      Validators.required,
      Validators.maxLength(4),
      Validators.minLength(4),
      Validators.pattern(regex24HourTime),
    ]),
    name: new FormControl('', [Validators.required]),
    driverId: new FormControl<number | null>(null, [Validators.required]),
    block: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    location: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    type: new FormControl(0),
    notes: new FormControl(''),
  });

  constructor() {
    effect(() => {
      if (this.groupsNeedRefresh()) this.getDpmGroups();
    });

    afterNextRender(() => {
      if (this.isGroupsLoaded() && !this.homeFormGroup.get('type')?.value) {
        this.setDefaultDpmType();
      }
    });
  }

  ngOnInit() {
    this.route.queryParamMap.pipe(first()).subscribe((value) => {
      const tab = value.get('tab') as DpmTab;
      if (tab) this.activateTab(tab);
    });

    this.userService
      .getUserNames()
      .pipe(first())
      .subscribe((users) => this.driverNames.set(users));
  }

  activateTab(tab: DpmTab) {
    this.activeTab.set({ new: 'new' === tab, edit: 'edit' === tab });
    switch (tab) {
      case 'new':
        this.saveTabInUrl(tab);
        this.titleService.setTitle(GenerateTitle('New DPM'));
        break;

      case 'edit':
        if (!this.isAdmin()) {
          this.resetToNewTab();
          return;
        }

        this.saveTabInUrl(tab);
        this.titleService.setTitle(GenerateTitle('Edit DPMs'));
        break;

      default:
        console.warn(`Unknown tab: ${tab}`);
        this.resetToNewTab();
    }
  }

  isAdmin(): boolean {
    const role = this.authService.userData.role as Roles;
    return editRoles.includes(role);
  }

  private resetToNewTab() {
    this.activeTab.set({ new: true, edit: false });
    this.clearQueryParams();
    this.titleService.setTitle(GenerateTitle('New DPM'));
  }

  private getDpmGroups() {
    if (!this.groupsNeedRefresh()) return;
    this.isGroupsLoaded.set(false);

    this.dpmService
      .getDpmGroups()
      .pipe(first())
      .subscribe((groups) => {
        this.dpmGroups.set(groups);
        this.isGroupsLoaded.set(true);
        this.groupsNeedRefresh.set(false);
        this.setDefaultDpmType();
      });
  }

  private setDefaultDpmType() {
    setDefaultDpmType(this.dpmGroups(), this.homeFormGroup);
  }

  private saveTabInUrl(tab: DpmTab) {
    // update query param to save tab state
    // need to set title in callback as it gets reset
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      replaceUrl: true,
    });
  }

  private clearQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      replaceUrl: true,
    });
  }

  protected readonly editRoles = editRoles;
}
