import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersComponent } from './users/users.component';
import { UiModule } from '../ui/ui.module';
import { SharedModule } from '../shared/shared.module';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { UserFormComponent } from './user-form/user-form.component';
import { AutoFocusModule } from 'primeng/autofocus';

@NgModule({
  declarations: [
    UsersListComponent,
    UsersComponent,
    UserDetailComponent,
    UserFormComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    UiModule,
    SharedModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    AutoFocusModule,
  ],
})
export class UsersModule {}
