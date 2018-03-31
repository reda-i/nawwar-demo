import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { AdminRoutingModule } from './admin-routing.module';
// import { ViewResourcesIdeasRequestsComponent } from './view-resources-ideas-requests/view-resources-ideas-requests.component';
import { ViewContentRequestsComponent } from './view-content-requests/view-content-requests.component';
import { PsychRequestsService } from './view-psych-requests/psych-requests.service';

import {
  ViewVerifiedContributerRequestsComponent
} from './view-verified-contributer-requests/view-verified-contributer-requests.component';
import { AdminService } from '../admin.service';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ViewPsychRequestsComponent } from './view-psych-requests/view-psych-requests.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatInputModule,
    MatChipsModule,
    MatSelectModule,
    FormsModule
  ],
  declarations: [AdminControlComponent,
    ViewContentRequestsComponent,
    ViewVerifiedContributerRequestsComponent,
    CategoryManagementComponent,
    ViewPsychRequestsComponent],
  exports: [
    MatButtonModule,
    MatButtonToggleModule
  ],
  providers: [
    AdminService, PsychRequestsService
  ]
})
export class AdminModule { }
