import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OtpComponent } from '@authentication/otp/otp.component';
import { OtpReq, OtpResp } from '@model/auth.model';
import { AuthService } from '@core/services/auth.service';
import { ApiErrorService } from '@service/api-error.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { IconService } from '@ant-design/icons-angular';
import { EyeInvisibleOutline, EyeOutline } from '@ant-design/icons-angular/icons';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, OtpComponent, NgxSpinnerComponent, SharedModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent implements OnInit {
  protected loginForm: FormGroup;
  public isOtpVerification: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private iconService: IconService,
    private spinner: NgxSpinnerService,
    private apiErrorService: ApiErrorService) {
          this.iconService.addIcon(EyeOutline, EyeInvisibleOutline);
     }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$')
      ]]
    });
  }

  protected onSubmit(): void {
    if (this.loginForm.valid) {
      // Input sanitization
      const value = this.loginForm.value;
      const param: OtpReq = {
        email: value.email,
        password: value.password
      };

      this.spinner.show();

      // Call Generate Otp
      this.authService.generateOtp(param).subscribe({
        next: (resp: OtpResp) => {
          console.log(resp.message);
          this.spinner.hide();
          sessionStorage.setItem('email', param.email);
          this.toggleOtpVerification();
        },
        error: () => {
          this.spinner.hide();
          this.apiErrorService.toastMessage('Error', 'Error!', 'Failed to sign-in!');
        }
      });
    }
  }

  protected toggleOtpVerification(): void {
    this.isOtpVerification = !this.isOtpVerification;
  }
}
