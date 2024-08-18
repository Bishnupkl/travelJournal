import {Component, OnInit} from '@angular/core';
import {User} from "../user";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {UsersdataService} from "../usersdata.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../authentication.service";
import {CommonModule} from "@angular/common";
import {environment} from "../../environments/environment.development";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  user!: User;
  errorMessage: string = '';
  isNotRegistered: boolean = false;

  constructor(private _formBuilder: FormBuilder, private _usersService: UsersdataService, private _authService: AuthenticationService, private _router: Router) {
    this.user = new User();
  }

  ngOnInit(): void {
    this.registrationForm = this._formBuilder.group(
      {
        name: '',
        username: '',
        password: '',
        passwordRepeat: ''
      }
    )
  }

  register() {
    if (!this.isEmptyForm()) {
      this.user.fill(this.registrationForm);
      this._usersService.registerNewUser(this.user).subscribe(
        {
          next: (user) => {
            this.errorMessage = '';
            this.isNotRegistered = false;
          },
          error: (error) => {
            this.errorMessage = environment.message.createFailMessage;
            this.isNotRegistered = true;
          },
          complete: () => {
            if (!this.isNotRegistered) {
              this.isNotRegistered = false;
              this.redirectToHomePageIfRegistered();

            }
          }
        }
      )
    }
  }



  redirectToHomePageIfRegistered() {

      this._router.navigate([environment.urlFrontend.home]);

  }

  isEmptyForm() {
    if (this.registrationForm.value.username === '' || this.registrationForm.value.password === '') {
      this.errorMessage = environment.message.missingLoginDetails;
      this.isNotRegistered = true;

      return true;
    } else if (this.registrationForm.value.password !== this.registrationForm.value.passwordRepeat) {
      this.errorMessage = environment.message.passwordMissedMatch;
      this.isNotRegistered = true;
      return true;
    }
    return false;
  }
}
