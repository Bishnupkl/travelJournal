import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {LoginComponent} from "../login/login.component";
import {AuthenticationService} from "../authentication.service";
import {jwtDecode} from "jwt-decode";
import {environment} from "../../environments/environment.development";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, LoginComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  title: string = environment.projectDetails.name;
  username: string = ''
  home: string = environment.urlFrontend.home;

  constructor(private _authService: AuthenticationService, private _router: Router) {
  }

  ngOnInit(): void {
    if (this._authService.getToken()) {
      const token = this._authService.getToken() + '';
      const userPayload: any = jwtDecode(token);
      // console.log(userPayload);
      this.username = userPayload.name ?? userPayload.username;
    }
  }

  isLoggedIn(): boolean {
    if (this._authService.isLoggedIn()) {
      const token = this._authService.getToken() + '';
      const userPayload: any = jwtDecode(token);
      this.username = userPayload.name ?? userPayload.username;
    }
    return this._authService.isLoggedIn();
  }

  logout() {
    this._authService.logout();
    this._router.navigate([this.home]);
  }

}
