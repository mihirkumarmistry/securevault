import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OtpComponent implements OnInit, OnDestroy {
  protected otpForm: FormGroup;
  protected countdown: number = 180;
  protected minutes: number = 3;
  protected seconds: number = 0;
  protected timer: any;

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.startCountdown();
  }

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  protected onSubmit(): void {
    if (this.otpForm.valid) {
      // Call auth process 
      // On responce toggle to Otp Page
      // this.authService.login(this.loginForm.value);

      // Imput sanitization
      // let formData = this.otpForm.value;
      // const param: Auth = {
      //   otp: formData.otp,
      // }
      // Call otp verification process 
      // On responce redirect to dashboard
      this.router.navigateByUrl('');
    }
  }

  protected startCountdown() {
    this.timer = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
        this.minutes = Math.floor(this.countdown / 60);
        this.seconds = this.countdown % 60;
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

}
