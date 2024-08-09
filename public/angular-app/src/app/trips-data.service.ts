import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class Gallery{
  #_id!:string;
  #picture!:string;
  #place!:string;

  constructor(picture:string, place:string){
    this.#picture=picture;
    this.#place=place;
  }

  get place(): string{
    return this.#place;
  }

}

export class Trip{
  #_id!:string;
  #country!:string;
  #airport!:string;
  #hotel!:string;
  #gallery!:[Gallery];
  
  get _id():string{
    return this.#_id;
  }

  get gallery():[Gallery]{
    return this.#gallery;
  }
  get country():string{
    return this.#country;
  }
  get airport():string{
    return this.#airport;
  }
  get hotel():string{
    return this.#hotel;
  }
  
  constructor(id:string,country:string,airport:string,hotel:string, gallary:[Gallery]){
    this.#_id=id;
    this.#country=country;
    this.#airport=airport;
    this.#hotel=hotel;
    this.#gallery=gallary;
  }
  
}
@Injectable({
  providedIn: 'root'
})
export class TripsDataService {
  
  constructor(private _httpClient:HttpClient) { }
  
  baseUrl:string='http://localhost:3000/';
  
  getTrips(pageNumber:number):Observable<Trip[]>{
    const url:string=this.baseUrl+"trips?pageNumber="+pageNumber;
    console.log(url);
    return this._httpClient.get<Trip[]>(url);
  }
  getTrip(tripId:string):Observable<Trip>{
    const url:string=this.baseUrl+"trips/"+tripId;
    return this._httpClient.get<Trip>(url);
  }
  deleteTrip(tripId:string):Observable<Trip>{
    const url:string=this.baseUrl+"trips/"+tripId;
    return this._httpClient.delete<Trip>(url);
  }
}
