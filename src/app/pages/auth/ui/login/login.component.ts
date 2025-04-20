import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/pages/auth/data-access/auth.service';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { InputComponent } from '@app/shared/input/input.component';
import { QBtnDirective } from '@app/shared/components/button/button.directive';
import { SnackBarService } from '@app/core/components/snackbar/snackbar.service';

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


  constructor() {
      effect(()=>{
        const loading = this.authService.isLoading();
        const emailControl = this.loginForm.controls['email'];
        if(!emailControl) return;

        if(loading){
          emailControl.disable();
        }else{
          emailControl.enable();
        }
      })

  }

  onSubmit(){
    this.authService.login(this.loginForm.controls['email'].value!).subscribe({
      next: (tokenId)=>{
            console.log(tokenId)
            this.router.navigate(['/auth/verify-email'],{
            queryParams: { id: tokenId },
            })
        }
    })
  }
}




  // this.snackbar.show({iconType: 'success', messageText: 'You have succesfully Logged In', headingText: 'Congratulations!', durationType: 'medium'})
    // this.snackbar.show({iconType: 'danger', messageText: 'Your Account has been expired', headingText: 'Account Expired', durationType: 'medium'})
    // this.snackbar.show({iconType: 'info', messageText: 'Enter Code', headingText: 'Please enter the verification Code', durationType: 'medium'})
    // this.snackbar.show({iconType: 'warn', messageText: 'Please do not refresh this page', headingText: 'Warning', durationType: 'medium'})
    // if(!this.loginForm.valid) return;
