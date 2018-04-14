import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PsychologistComponent } from './psychologist/psychologist.component';
import { AddPsychRequestComponent } from './add-psych-request/add-psych-request.component';
import { EditPsychComponent } from './edit-psych/edit-psych.component';
const routes = [
  { path: 'psychologist', component: PsychologistComponent },
  { path: 'psychologist/editPsych', component: EditPsychComponent },
  { path: 'psychologist/request/add', component: AddPsychRequestComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PsychologistRoutingModule { }
