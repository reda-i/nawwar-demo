import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { MessagingComponent } from './messaging/messaging.component';
const routes = [
  {
    path: '',
    component: MessagingComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MessagingRoutingModule { }
