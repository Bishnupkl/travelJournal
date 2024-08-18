import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TripsDataService} from '../trips-data.service';
import {Trip} from "../trip";
import {environment} from "../../environments/environment.development";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent implements OnInit {
  isPreviousDisabled: boolean = false;
  isNextDisabled: boolean = false;
  tripsNotFound: string = '';

  searchQuery: string = '';

  isError: boolean = false;
  errorMessage: string = ''
  private pageNumber = environment.keys.pageNumber;

  page: number = environment.numbers.page;
  total_page!: number;
  trips: Trip[] = new Array<Trip>();

  constructor(private _tripsService: TripsDataService) {
    this.page = sessionStorage.getItem(this.pageNumber) == null ? environment.numbers.page : Number(sessionStorage.getItem(this.pageNumber))
  }

  previousClicked() {
    if (this.page > 1) {
      this.isNextDisabled = false;
      this.page--;
      this.setPageNumber(this.page);
      this.getTrips(this.page,this.searchQuery);
    } else {
      this.isPreviousDisabled = true;
    }
  }

  nextClicked() {
    if (this.page > this.total_page - 1) {
      this.isNextDisabled = true;
    } else {
      this.page++;
      this.setPageNumber(this.page);
      this.getTrips(this.page,this.searchQuery);
      this.isPreviousDisabled = false;
    }
  }

  ngOnInit(): void {
    this.getPageSize(this.searchQuery);
    this.getTrips(this.page,this.searchQuery);
  }

  getPageSize(name: string | null) {
    this._tripsService.getTotalTrips(name).subscribe(trips => {
      this.total_page = Math.ceil(trips / environment.numbers.limit);
      if (this.total_page < 1) {
        this.total_page = 1;
      }
    });
  }

  getTrips(pageNumber: number,name:string): void {
    this._tripsService.getTrips(pageNumber,name).subscribe({
      next: (trips) => {
        this.trips = trips;
      },
      error: (error) => {
        this.tripsNotFound = environment.message.tripsNotFound;
      },
      complete: () => {
        this.trips = this.trips;

      }
    });
  }

  setPageNumber(page: number) {
    this.page = page;
    sessionStorage.setItem(this.pageNumber, `${page}`);
  }

  searchTrips() {
    this.getPageSize(this.searchQuery)
    this.getTrips(this.page, this.searchQuery)
  }
}
