import {Component, Input, OnInit} from '@angular/core';
import {Gallery} from "../gallery";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../authentication.service";
import {TripsDataService} from "../trips-data.service";
import {FilterPipe} from "../filter.pipe";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-galleries',
  standalone: true,
  imports: [
    FilterPipe,CommonModule
  ],
  templateUrl: './galleries.component.html',
  styleUrl: './galleries.component.css'
})
export class GalleriesComponent implements OnInit {
  @Input() galleries!: Gallery[];
  tripId!: string;

  constructor(private _activatedRouter: ActivatedRoute, private _router: Router, private _authService: AuthenticationService, private _tripService: TripsDataService) { }
  ngOnInit(): void {
    this.galleries = new Array<Gallery>();
    this.tripId = this._activatedRouter.snapshot.params['id'];
  }

  addNewGallery(): void {
    const url = '/trip/' + this.tripId + '/add-gallery';
    this._router.navigate([url])
  }
  isLoggedIn(): boolean {
    return this._authService.isLoggedIn();
  }
  delete(galleryId: string) {
    this._tripService.deleteGallery(this.tripId, galleryId).subscribe(trip => {
      this.galleries = trip.gallery
    })
  }
  update(galleryId: string) {
    const url = '/trip/' + this.tripId + '/edit-gallery/' + galleryId;
    this._router.navigate([url])
  }
}
