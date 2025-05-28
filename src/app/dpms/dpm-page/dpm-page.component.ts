import { AfterViewInit, Component, effect, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { DPMGroup } from '../../models/dpm-type';
import { DpmService } from '../../services/dpm.service';
import { first } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DpmTab } from '../../users/shared/tab.types';
import { Title } from '@angular/platform-browser';
import { GenerateTitle } from '../../shared/title-helper';
import { NewDpmComponent } from '../new-dpm/new-dpm.component';
import { EditDpmsComponent } from '../edit-dpms/edit-dpms.component';
import UsernameDto from '../../models/username-dto';
import { UserService } from '../../services/user.service';
import { RemoveIfUnauthorizedDirective } from '../../auth/directives/remove-if-unauthorized.directive';
import { Roles } from '../../auth/roles.types';
import { AuthService } from '../../services/auth.service';

const regex24HourTime = /^(?:[01][0-9]|2[0-3])[0-5][0-9](?::[0-5][0-9])?$/;
const editRoles: Roles[] = ['ADMIN'];

@Component({
  selector: 'app-dpm-page',
  imports: [NgClass, NewDpmComponent, EditDpmsComponent, RemoveIfUnauthorizedDirective],
  templateUrl: './dpm-page.component.html',
  styleUrl: './dpm-page.component.css',
})
export class DpmPageComponent implements OnInit, AfterViewInit {
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
    block: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    location: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    type: new FormControl(0),
    notes: new FormControl(''),
  });

  constructor(
    private dpmService: DpmService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {
    effect(() => {
      if (this.groupsNeedRefresh()) this.getDpmGroups();
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

  ngAfterViewInit() {
    // additional check after view init in case the above wasn't enough
    setTimeout(() => {
      if (this.isGroupsLoaded() && !this.homeFormGroup.get('type')?.value) {
        this.setDefaultDpmType();
      }
    }, 0);
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

  // New helper method to set the default DPM type
  private setDefaultDpmType() {
    const groups = this.dpmGroups();
    if (groups && groups.length > 0 && groups[0].dpms && groups[0].dpms.length > 0) {
      this.homeFormGroup.patchValue({
        type: groups[0].dpms[0].id,
      });

      // Force detection of the change
      setTimeout(() => {
        this.homeFormGroup.updateValueAndValidity();
      }, 0);
    } else {
      console.warn('No DPM groups or types found to set as default');
    }
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
