import { Component, OnInit } from '@angular/core';
import { TripsDataService } from '../trips-data.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import {Trip} from "../trip";
import {Gallery} from "../gallery";
import {AuthenticationService} from "../authentication.service";
import {GalleriesComponent} from "../galleries/galleries.component";
import {environment} from "../../environments/environment.development";

@Component({
  selector: 'app-trip',
  standalone: true,
  imports: [CommonModule, RouterLink, GalleriesComponent],
  templateUrl: './trip.component.html',
  styleUrl: './trip.component.css'
})
export class TripComponent implements OnInit {
  tripId!: string;
  trip!: Trip;
  constructor(private _tripsService: TripsDataService, private _authService: AuthenticationService, private _activedRoute: ActivatedRoute, private _router: Router) {
    // @ts-ignore
    this.trip = new Trip();
  }

  ngOnInit(): void {
    this.tripId = this._activedRoute.snapshot.params[environment.params.tripId];
    this._tripsService.getTrip(this.tripId).subscribe(trip => {
      this.trip = trip;
    })
  }

  isLoggedIn(): boolean {
    return this._authService.isLoggedIn();
  }
  delete() {

    this._tripsService.deleteTrip(this.tripId).subscribe(trip => {
      this._router.navigate([environment.urlFrontend.trips]);
    })
  }
  update() {
    this._router.navigate([`${environment.urlFrontend.editTrip}/${this.tripId}`]);

  }
}

