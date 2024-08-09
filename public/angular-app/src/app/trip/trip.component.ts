import { Component, OnInit } from '@angular/core';
import { Gallery, Trip, TripsDataService } from '../trips-data.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip.component.html',
  styleUrl: './trip.component.css'
})
export class TripComponent  implements OnInit{
  trip!:Trip;
  gallery!:[Gallery];
  constructor(private _tripService:TripsDataService, private _route:ActivatedRoute){
    this.gallery = [new Gallery("","")];
    this.trip = new Trip("", "", "", "", this.gallery)
  }
  ngOnInit(): void {
    console.log(this._route.snapshot.params);
    const tripId=this._route.snapshot.params["tripId"];
    this._tripService.getTrip(tripId).subscribe(trip=>{
      this.trip=trip;
      this.gallery = trip.gallery;
    })
  }

  // trips!:Trip[];
  // constructor(private _tripService:TripsDataService){}
  // ngOnInit(): void {
  //   this._tripService.getTrips().subscribe(trips=>{
  //     this.trips=trips;

      
  //   });
  // }
  
  
  
  
  
}
