import { Injectable } from '@angular/core';
import {Token} from "./token";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  #token!:Token | null ;

  get token(): Token | null {
    return this.#token;
  }

  set token(value: Token | null) {
    this.#token = value;
  }


  private tokenKey = 'authToken';

  setToken(token: Token) {
    this.#token = token;
    localStorage.setItem(this.tokenKey, token.token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.tokenKey) !== null;
  }

  logout() {
    this.clearToken();
  }}
