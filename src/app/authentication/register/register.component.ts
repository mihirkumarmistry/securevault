import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Auth } from '@model/auth.model';
import { AppRoutes } from '@shared/routes/routes.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {
  protected appRoutes = AppRoutes;
  protected registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  protected onSubmit(): void {
    if (this.registerForm.valid) {
      // Imput sanitization
      let formData = this.registerForm.value;
      const param: Auth = {
        username: formData.username,
        password: formData.password
      }
      // Call auth process 
      // On responce toggle to Otp Page
      this.authService.login(param);
    }
  }
}
