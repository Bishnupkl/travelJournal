import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {TripsComponent} from './trips/trips.component';
import {TripComponent} from './trip/trip.component';
import {RegisterComponent} from "./register/register.component";
import {AddTripComponent} from "./add-trip/add-trip.component";
import {ErrorPageComponent} from "./error-page/error-page.component";
import {environment} from "../environments/environment.development";
import {EditTripComponent} from "./edit-trip/edit-trip.component";
import {AddGalleryComponent} from "./add-gallery/add-gallery.component";
import {EditGalleryComponent} from "./edit-gallery/edit-gallery.component";


const home = environment.urlFrontend.home;
const trips = environment.urlFrontend.trips;
const trip_id = environment.urlFrontend.trip_id;
const createTrip = environment.urlFrontend.createTrip;
const editTrip_id = environment.urlFrontend.editTrip_id;
const createGallery = environment.urlFrontend.createGallery;
const editGallery = environment.urlFrontend.editGallery;
const signUp = environment.urlFrontend.signUp;
const error = environment.urlFrontend.error;


export const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch: "full"},
  {path: home, component: HomeComponent},
  {path: trips, component: TripsComponent},
  {path: createTrip, component: AddTripComponent},
  {path: trip_id, component: TripComponent},
  {path: signUp, component: RegisterComponent},
  {
    path: editTrip_id, component: EditTripComponent
  },
  {
    path: createGallery, component: AddGalleryComponent
  },
  {
    path: editGallery, component: EditGalleryComponent
  },
  {path: error, component: ErrorPageComponent}
];
