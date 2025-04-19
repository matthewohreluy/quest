import { Component, effect, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/input/input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QBtnDirective } from '../../../shared/components/button/button.directive';
import { AuthService } from '../auth.service';
import { SnackBarService } from '../../../core/components/snackbar/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'quest-login',
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, QBtnDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  host: { class: "grow flex flex-col items-center justify-center space-y-12"}
})
export class LoginComponent{

  loginForm = new FormGroup({
    email: new FormControl({value: '', disabled: false},[Validators.required])
  });
  snackbar = inject(SnackBarService);
  authService = inject(AuthService);
  router = inject(Router);
  isLoading = this.authService.isLoading;
  isTokenAvailable = this.authService.isTokenAvailable;
  tokenId = this.authService.tokenId;

  constructor() {
      effect(()=>{
        const loading = this.isLoading();
        const emailControl = this.loginForm.controls['email'];
        if(!emailControl) return;

        if(loading){
          emailControl.disable();
        }else{
          emailControl.enable();
        }
      })
      effect(()=>{
        const hasToken = this.isTokenAvailable();
        const tokenId = this.tokenId();

        if(hasToken){
          this.router.navigate(['/auth/verify-email'],{
            queryParams: { id: tokenId }
          })
        }
      })
  }

  onSubmit(){
    this.authService.login(this.loginForm.controls['email'].value!)
  }
}




  // this.snackbar.show({iconType: 'success', messageText: 'You have succesfully Logged In', headingText: 'Congratulations!', durationType: 'medium'})
    // this.snackbar.show({iconType: 'danger', messageText: 'Your Account has been expired', headingText: 'Account Expired', durationType: 'medium'})
    // this.snackbar.show({iconType: 'info', messageText: 'Enter Code', headingText: 'Please enter the verification Code', durationType: 'medium'})
    // this.snackbar.show({iconType: 'warn', messageText: 'Please do not refresh this page', headingText: 'Warning', durationType: 'medium'})
    // if(!this.loginForm.valid) return;
