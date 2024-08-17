import {Component, OnInit} from '@angular/core';
import {Trip} from "../trip";
import {AuthenticationService} from "../authentication.service";
import {TripsDataService} from "../trips-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../environments/environment.development";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgIf} from "@angular/common";

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-trip.component.html',
  styleUrl: './edit-trip.component.css'
})
export class EditTripComponent implements OnInit {

  tripId!: string;
  trip!: Trip;
  updateFailMessage: string = ''
  isUpdateFail: boolean = false;

  constructor(private _authService: AuthenticationService, private _tripsService: TripsDataService, private _router: Router, private _activatedRouter: ActivatedRoute) {
    // @ts-ignore
    this.trip = new Trip();
    if (!this._authService.isLoggedIn()) {
      this._router.navigate([environment.urlFrontend.signIn]);
    }
  }
  ngOnInit(): void {
    this.tripId = this._activatedRouter.snapshot.params[environment.params.tripId];
    this._tripsService.getTrip(this.tripId).subscribe(trip => {
      // this.trip = trip // it will lose jsonify
      // @ts-ignore
      this.trip = Object.assign(new Trip(), trip);
    })
  }

  update(): void {
    if (!this.isBlank()) {
      this._tripsService.updateTrip(this.tripId, this.trip).subscribe({
        next: (trip) => {
          this.updateFailMessage = ''
          this.isUpdateFail = false;
        },
        error: (error) => {
          this.updateFailMessage = environment.message.updateFailMessage;
          this.isUpdateFail = true;
        },
        complete: () => {
          if (!this.isUpdateFail) {
            this.updateFailMessage = ''
            this.isUpdateFail = false;
            this._router.navigate([`${environment.urlFrontend.trip}/${this.trip._id}`]);
          }
        }
      });
    }
  }

  isBlank(): boolean {
    if (this.trip.country === '' || this.trip.airport === '' || this.trip.hotel === '') {
      this.updateFailMessage = environment.message.filledInTheBlank;
      this.isUpdateFail = true;
      return true;
    }
    return false;
  }

}

