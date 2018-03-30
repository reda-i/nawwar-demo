import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { ViewContentRequestsComponent } from './view-content-requests/view-content-requests.component';


import { CategoryManagementComponent } from './category-management/category-management.component';
const routes = [
  { path: 'admin', component: AdminControlComponent },
  { path: 'admin/ContentRequests', component: ViewContentRequestsComponent },
  { path: 'admin/category', component: CategoryManagementComponent }
];
@NgModule({
  imports: [

    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
