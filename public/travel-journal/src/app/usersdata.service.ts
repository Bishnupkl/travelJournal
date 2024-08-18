import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "./user";
import {Token} from "./token";

@Injectable({
  providedIn: 'root'
})
export class UsersdataService {

  private _baseUrl = "http://localhost:3000/api/users";

  constructor(private _httpClient: HttpClient) { }
  getUsers(): Observable<User[]> {
    const url: string = this._baseUrl;
    return this._httpClient.get<User[]>(url);
  }
  login(user: User): Observable<Token> {
    const url: string = this._baseUrl + "/login";
    return this._httpClient.post<Token>(url, user.jsonify());
  }
  registerNewUser(user: User): Observable<User> {
    const url: string = this._baseUrl;
    return this._httpClient.post<User>(url, user.jsonifyCreate());
  }
}
