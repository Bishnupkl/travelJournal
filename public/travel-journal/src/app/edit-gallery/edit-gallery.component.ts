import {Component, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {FormsModule, NgForm} from "@angular/forms";
import {Gallery} from "../gallery";
import {AuthenticationService} from "../authentication.service";
import {TripsDataService} from "../trips-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-edit-gallery',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './edit-gallery.component.html',
  styleUrl: './edit-gallery.component.css'
})
export class EditGalleryComponent implements OnInit{
  @ViewChild(environment.forms.galleryForm)
  galleryForm!: NgForm;
  gallery!: Gallery;
  tripId!: string;
  galleryId!: string;

  updateFailMessage: string = ''
  isUpdateFail: boolean = false;

  constructor(private _authService: AuthenticationService, private _tripsService: TripsDataService, private _router: Router, private _activatedRouter: ActivatedRoute) {
    if (!this._authService.isLoggedIn()) {
      this._router.navigate([environment.urlFrontend.signIn]);
    }
  }
  ngOnInit(): void {
    // @ts-ignore
    this.gallery = new Gallery();
    this.tripId = this._activatedRouter.snapshot.params[environment.params.tripId];
    this.galleryId = this._activatedRouter.snapshot.params[environment.params.galleryId];
    this._tripsService.getGallery(this.tripId, this.galleryId).subscribe(gallery => {
      // @ts-ignore
      this.gallery = Object.assign(new Gallery(), gallery);
    })
  }

  update(): void {
    if (!this.isBlank()) {
      this._tripsService.updateGallery(this.tripId, this.galleryId, this.gallery).subscribe({
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
            this._router.navigate([`${environment.urlFrontend.trip}/${this.tripId}`]);
          }
        }
      });
    }
  }
  isBlank(): boolean {
    if (this.gallery.place === ''  || this.gallery.picture === '') {
      this.updateFailMessage = environment.message.filledInTheBlank;
      this.isUpdateFail = true;
      return true;
    }
    return false;
  }
}

