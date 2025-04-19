import { Component, effect, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthStore } from '../auth.store';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { distinctUntilChanged, filter, fromEvent, map, Subscription, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'quest-verify-email',
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
  host: { class: "grow flex flex-col items-center justify-center"}
})
export class VerifyEmailComponent implements OnInit, OnDestroy{
  authService = inject(AuthService);
  el = inject(ElementRef);
  route = inject(ActivatedRoute);

  subscription: Subscription = new Subscription();


  isLoading = this.authService.isLoading;

  tokenForm: FormGroup = new FormGroup({
    code1: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(1), Validators.minLength(1)])),
    code2: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(1), Validators.minLength(1)])),
    code3: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(1), Validators.minLength(1)])),
    code4: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(1), Validators.minLength(1)])),
    code5: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(1), Validators.minLength(1)])),
    code6: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(1), Validators.minLength(1)])),
  })

  constructor(){
    effect(()=>{
      const loading = this.isLoading();
      if(loading) this.tokenForm.disable();
      else this.tokenForm.enable();
    })
  }

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  initData(){
    this.route.queryParams.pipe(
      map(params=>params['id']),
      tap(id=>this.authService.setToken(id)),
    ).subscribe();
  }

  resendCode(){
    this.authService.resendToken()
  }

  initForm(){
    console.log(this.tokenForm.valid)
    for(let i = 1; i<=6; i++){
      this.subscription.add(
        this.tokenForm.controls['code'+ i ].valueChanges
        .pipe(
          distinctUntilChanged()
        )
        .subscribe((text)=>{
          this.validateFieldAndNext(text, i)
        })
      );

      this.subscription.add(
        fromEvent(this.el.nativeElement.querySelector('[formcontrolname="code' + (i) + '"]'), 'keydown')
        .pipe(
          filter((event: any)=>event.keyCode === 8 || event.keyCode === 46)
        )
        .subscribe((event: any)=>{
          if(event.keyCode === 8 || event.keyCode === 46){
            this.moveBack(i)
          }
        })
      );
    }
    const firstInput = this.el.nativeElement.querySelector('[formcontrolname="code1"]');
    if (firstInput) {
      firstInput.focus();
    }
  }

  moveBack(index: number){
    if(index > 1 && this.tokenForm.controls['code' + index].value === ''){
      let inputFocus = this.el.nativeElement.querySelector('[formcontrolname="code' + (index - 1) + '"]');
      inputFocus.focus();
    }
  }

  validateFieldAndNext(text: string, index: number){
    // only numbers
    const pattern = /^[0-9]*$/;
    // invalid character, prevent input
    if (!pattern.test(text)) {
      text = text.replace(/[^0-9]/g, "");
      this.tokenForm.controls['code' + index].setValue(text);
    }

    if(this.tokenForm.controls['code' + index].value.length == 1)
    {
      if(index <6){
        let inputFocus = this.el.nativeElement.querySelector('[formcontrolname="code' + (index+1) + '"]');
        inputFocus.focus();
      }
    }
  }

  onSubmit(){
    let token: string = '';
    for(let key in this.tokenForm.value){
      token+=this.tokenForm.value[key];
    }

    // const data = {
    //   id: this.id,
    //   token: token
    // }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
