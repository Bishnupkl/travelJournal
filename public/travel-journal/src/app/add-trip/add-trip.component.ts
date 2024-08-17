import {Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {Trip} from "../trip";
import {AuthenticationService} from "../authentication.service";
import {TripsDataService} from "../trips-data.service";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [
    FormsModule, CommonModule
  ],
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css'
})
export class AddTripComponent implements OnInit {
  @ViewChild(environment.forms.tripForm)
  tripForm!: NgForm;
  trip!: Trip;
  location!: Location;

  createFailMessage: string = '';
  isCreateFail: boolean = false;

  constructor(private _authService: AuthenticationService, private _tripsService: TripsDataService, private _router: Router) {
    if (!this._authService.isLoggedIn()) {
      this._router.navigate([environment.urlFrontend.home]);
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.tripForm.setValue(
        {
          country: '',
          airport: '',
          hotel: ''
        }
      );
    }, 0);
  }

  create(form: NgForm): void {
    if (!this.emptyForm()) {

      this.trip = this.createTripObject(form)
      let createdTrip: Trip;
      this._tripsService.addTrip(this.trip).subscribe({
        next: (trip) => {
          this.createFailMessage = '';
          this.isCreateFail = false;
          this.trip = trip;
          createdTrip = trip;
        },
        error: (error) => {
          this.createFailMessage = environment.message.createFailMessage;
          ;
          this.isCreateFail = true;
        },
        complete: () => {
          if (!this.isCreateFail) {
            this.createFailMessage = '';
            this.isCreateFail = false;
            this._router.navigate([`/${environment.urlFrontend.trip}/${this.trip._id}`]);
          }
        }
      })
    }
  }


  createTripObject(form: NgForm) {
    // console.log(form.value);
    // @ts-ignore
    const tripObject = new Trip();
    tripObject.fill(form);
    return tripObject;
  }

  emptyForm(): boolean {
    if (this.tripForm.value.country === '' || this.tripForm.value.airport === '' || this.tripForm.value.hotel === '') {
      this.createFailMessage = environment.message.filledInTheBlank;
      this.isCreateFail = true;
      return true;
    }
    return false;
  }
}
