import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OtpComponent } from '@authentication/otp/otp.component';
import { AuthService } from '@core/services/auth.service';
import { Auth } from '@model/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, OtpComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent implements OnInit {
  protected loginForm: FormGroup;
  public isOtpVerification: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  protected onSubmit(): void {
    if (this.loginForm.valid) {
      // Imput sanitization
      // let formData = this.loginForm.value;
      // const param: Auth = {
      //   username: formData.username,
      //   password: formData.password
      // }
      // Call auth process 
      // On responce toggle to Otp Page
      //this.authService.login(param);
      this.toggleOtpVerification();
    }
  }

  protected toggleOtpVerification(): void {
    this.isOtpVerification = !this.isOtpVerification;
  }
}
