import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {Trip} from "./trip";
import {Gallery} from "./gallery";
import {environment} from "../environments/environment.development";


@Injectable({
  providedIn: 'root'
})
export class TripsDataService {

  constructor(private _httpClient: HttpClient) {
  }

  baseUrl: string = environment.urlApi.baseTripUrl;

  getTrips(pageNumber: number, name: string | null): Observable<Trip[]> {
    let url: string = this.baseUrl
    if (pageNumber || (name && name !== ''))
      url = `${url}?`;
    if (pageNumber) {
      url = `${url}${environment.urlApi.query.pageNumber}=${pageNumber}`
    }
    if (name && name !== '') {
      if (pageNumber)
        url = `${url}&`
      url = `${url}${environment.urlApi.query.name}=${name}`
    }
    return this._httpClient.get<Trip[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  getTotalTrips(name: string | null): Observable<number> {
    let url: string = `${this.baseUrl}/${environment.urlApi.total}`;
    if (name && name !== '') {
      url = `${url}?${environment.urlApi.query.name}=${name}`
    }
    return this._httpClient.get<number>(url).pipe(
      catchError(this.handleError)
    );
  }

  getTrip(tripId: string): Observable<Trip> {
    const url: string = this.baseUrl + "/" + tripId;
    return this._httpClient.get<Trip>(url);
  }

  addTrip(trip: Trip): Observable<Trip> {
    const url: string = this.baseUrl;
    return this._httpClient.post<Trip>(url, (trip.jsonify()));
  }

  updateTrip(tripId: string, trip: Trip): Observable<Trip> {
    const url: string = this.baseUrl + "/" + tripId;
    return this._httpClient.patch<Trip>(url, (trip.jsonify()));
  }

  deleteTrip(tripId: string): Observable<Trip> {
    const url: string = this.baseUrl + "/" + tripId;
    return this._httpClient.delete<Trip>(url);
  }

  getGallery(tripId: string, galleryId: string): Observable<Gallery> {
    const url: string = this.baseUrl + '/' + tripId + '/gallery/' + galleryId;
    return this._httpClient.get<Gallery>(url);
  }

  addGallery(tripId: string, gallery: Gallery): Observable<Trip> {
    const url: string = this.baseUrl + "/" + tripId + '/gallery';
    return this._httpClient.post<Trip>(url, (gallery.jsonify()));
  }

  updateGallery(tripId: string, galleryId: string, gallery: Gallery): Observable<Trip> {

    const url: string = this.baseUrl + "/" + tripId + '/gallery/' + galleryId;
    return this._httpClient.patch<Trip>(url, (gallery.jsonify()));
  }

  deleteGallery(tripId: string, galleryId: string): Observable<Trip> {
    const url: string = this.baseUrl + "/" + tripId + '/gallery/' + galleryId;
    return this._httpClient.delete<Trip>(url);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError({ message: error.error.message });
  }
}
