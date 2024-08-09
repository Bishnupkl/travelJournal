import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Trip, TripsDataService } from '../trips-data.service';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent  implements OnInit{
  pageNumber:number = 1;
  trips!:Trip[];
  isNextClicked:boolean = true;
  constructor(private _tripService:TripsDataService){
  }
  ngOnInit(): void {
    this._getTrip(this.pageNumber);
  }
  
  previousClicked(){
    this.pageNumber--;
    this._getTrip(this.pageNumber);
  } 
  nextClicked(){
    this.pageNumber++;
    this._getTrip(this.pageNumber);
  }  
  isPreviousDisabled():boolean{
    return this.pageNumber <=1;
  }
  _getTrip(pageNumber:number){
    this._tripService.getTrips(pageNumber).subscribe(trips=>{
      this.trips=trips;
      if(this.trips.length<7){
        this.isNextClicked = false;
      }
      else{
        this.isNextClicked = true;
      }
    });
  }
  deleteClick(id:string){
    console.log(id);
    this._tripService.deleteTrip(id).subscribe(trip=>{
      this._getTrip(this.pageNumber);
    })
  }
}
