import { CommonModule, NgIf, NgSwitch } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FirstKeyPipe } from '../../shared/first-key.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FirstKeyPipe],
  templateUrl: './registration.component.html',
  styles: ``
})
export class RegistrationComponent {
  constructor(public fb: FormBuilder, private authService: AuthService, private ngToast: ToastrService) { }
  isSubmitted: boolean = false;

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get("password");
    const confirmPassword = control.get("confirmPassword");

    if (password && confirmPassword && password.value != confirmPassword.value) {
      confirmPassword?.setErrors({
        passwordMismatch: true
      })
    }
    else {
      confirmPassword?.setErrors(null);
    }
    return null;
  }
  form = this.fb.group<any>({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/(?=.*[^a-zA-Z0-9])/)]],
    confirmPassword: ['']
  },
    {
      validators: this.passwordMatchValidator
    });
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.authService.createUser(this.form.value)
        .subscribe({
          next: (res: any) => {
            if (res.succeeded) {
              this.form.reset();
              this.isSubmitted = false;
              this.ngToast.success("New user has been created.", "Registration")
            }
          },
          error: err => {
            console.log(err);
            if (err.error.errors) {
              err.error.errors.forEach((x: any) => {
                switch (x.code) {
                  case 'DuplicateUserName':
                    break;
                  case "DuplicateEmail":
                    this.ngToast.error('Email already taken.', 'Registration Failed')
                    break;

                  default:
                    this.ngToast.error('Contact to support department', 'Registration Failed')
                }
              }
              );
            } else {
              console.log('Error', err);
            }
          }
        })
    }
    console.log(this.form.value)
  }
  hasDisplayableError(controlName: string): Boolean {

    const control = this.form.get(controlName);
    return Boolean(control?.invalid)
      &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
  }
}
