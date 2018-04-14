
/* tslint-disable max-len */
/* tslint-disable max-statements */

import { Component, OnInit } from '@angular/core';
import { PsychologistService } from '../psychologist.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AddPsychRequestComponent } from '../add-psych-request/add-psych-request.component';
import { EditPsychComponent } from '../edit-psych/edit-psych.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Psychologist } from '../psychologist/psychologist';


@Component({
  selector: 'app-psychologist',
  templateUrl: './psychologist.component.html',
  styleUrls: ['./psychologist.component.scss']
})
export class PsychologistComponent implements OnInit {

  user: any;
  psychologists: any[];
  admin: boolean;
  idInput = new FormControl();
  psychologist: Psychologist;

  constructor(private psychologistService: PsychologistService,
              public snackBar: MatSnackBar,
              private authService: AuthService,
              private router: Router,
              private dialog: MatDialog) { }
  formInput = <any>{};


  getPsychologists(): void {
    let self = this;
    self.psychologistService.getPsychologists().subscribe(function (psychs) {
      self.psychologists = psychs.data;
    });
  }
  addRequest(): void {
    const self = this;
    let dialogOpener = this.dialog.open(AddPsychRequestComponent, {
      width: '60%',
      height: '90%'
    });

    dialogOpener.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      self.getPsychologists();
    });
  }
  deletePsychologist(index: any): void {
    const self = this;
    if (this.admin) {
      this.psychologistService.deletePsychologist(self.psychologists[index]._id).subscribe(function (res) {
        if (res.err != null) {
          /* if an error returned notify the user to try again */
          self.snackBar.open('Something went wrong, please try again.', '', {
            duration: 2500
          });
        } else {
          /* everything went great!! notify the user it was a success then reload. */
          self.snackBar.open(res.msg, '', {
            duration: 2300
          });
          self.getPsychologists();
        }
      });
    } else { //if not admin

      if( this.getPsychologistData(this.idInput.value) == self.psychologists[index]._id )  {
        this.psychologistService.deletePsychologist(self.psychologists[index]._id).subscribe(function (res) {
          if (res.err != null) {
            /* if an error returned notify the user to try again */
            self.snackBar.open('Something went wrong, please try again.', '', {
              duration: 2500
            });
          } else {
            /* everything went great!! notify the user it was a success then reload. */
            alert('please insert the correct ID');
            self.snackBar.open(res.msg, '', {
              duration: 2300
            });
            self.getPsychologists();
          }
        });
            
      }
    }
  }
  ngOnInit() {
    const self = this;
    const userDataColumns = ['isAdmin'];
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.user = res.data;
      if (!self.user) {
        self.router.navigate(['/']);
      } else {
        self.admin = self.user.isAdmin;
      }
      self.getPsychologists();
    });
  }

  getPsychologistData(idIn: String): void {
    let self = this;
    self.psychologistService.getPsychologistData(idIn).subscribe(function (psych) {
      if (psych) {
        self.psychologist = psych.data;
        self.idInput.setValue(null);
        let dialogRef = self.dialog.open(EditPsychComponent, {
          width: '60%',
          height: '90%',
          data: { psych: self.psychologist }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          self.getPsychologists();
        });
      } else {
        let msg1 = 'The ID you Entered doesn\'t exist,';
        let msg2 = ' Make sure you typed the right ID and that this is your information then try again.';
        self.snackBar.open(msg1 + msg2, '', {
          duration: 3500
        });
      }
    });
  }

  goToEdit(i): void {
    const self = this;
    if (! ( this.idInput.value === this.psychologists[i]._id)) {
      let msg1 = 'The ID you Entered doesn\'t match the Information you selected,';
        let msg2 = ' Make sure you typed the right ID and that this is your information then try again.';
        self.snackBar.open(msg1 + msg2, '', {
          duration: 3500
        });
    } else {
      this.getPsychologistData(this.idInput.value);
  }

  }
}
