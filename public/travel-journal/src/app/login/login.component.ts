import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {User} from "../user";
import {UsersdataService} from "../usersdata.service";
import {AuthenticationService} from "../authentication.service";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import {environment} from "../../environments/environment.development";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  token!: string;
  loginForm!: FormGroup;
  user!: User

  errorMessage: string = '';
  isAuthorized: boolean = false;

  constructor(private _formBuilder: FormBuilder, private _usersService: UsersdataService, private _authService: AuthenticationService, private _router: Router) {
    this.user = new User();
    this.redirectToHomePageIfLogged();
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      username: "",
      password: "",
    });
  }

  login() {
    if (!this.isEmpty()) {
    this.user.fill(this.loginForm);
    this.getToken(this.user);
  }
  }

  getToken(user: User) {
    this._usersService.login(user).subscribe(
      {
        next: (token) => {
          this.errorMessage = '';
          this.isAuthorized = true;
          this._authService.setToken(token);
        },
        error: (error) => {
          this.errorMessage = environment.message.unauthorizedMessage;
          this.isAuthorized = false;
        },
        complete: () => {
          if (!this.isAuthorized) {
            this.errorMessage = '';
            this.isAuthorized = true;
            this.redirectToHomePageIfLogged();
          }
        }
      }
    )
  }

  redirectToHomePageIfLogged() {
    if (this._authService.isLoggedIn()) {
      this._router.navigate([environment.urlFrontend.home]);
    }

  }

  logout() {
    this._authService.logout();
    this._router.navigate([environment.urlFrontend.home]);
  }

  isEmpty(): boolean {
    if (this.loginForm.value.username === '' || this.loginForm.value.password === '') {
      this.errorMessage = environment.message.missingLoginDetails;
      this.isAuthorized = false;
      return true;
    }
    return false;
  }
}
