import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  constructor(public fb: FormBuilder, private authService: AuthService, private ngToast: ToastrService, private router: Router) { }
  isSubmitted: boolean = false;

  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid)
      &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.authService.signin(this.form.value).subscribe({
        next: (res: any) => {
          localStorage.setItem("token", res.token);
          this.router.navigateByUrl("/dashboard");
        },
        error: err => {
          if (err.status == 400) {
            this.ngToast.error("Incorrect email or password", "Login failed")
          } else
            this.ngToast.error("error during login \n", err)
        }
      })
    }
  }
}
