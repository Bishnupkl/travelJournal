import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TripsComponent } from './trips/trips.component';
import { TripComponent } from './trip/trip.component';

export const routes: Routes = [
    {path:"", redirectTo:"home",pathMatch:"full"},
    {path:"home",component:HomeComponent},
    {path:"trips",component:TripsComponent},
    {path:"trip/:tripId",component:TripComponent}
];
