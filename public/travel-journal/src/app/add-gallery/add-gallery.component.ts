import {Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {environment} from "../../environments/environment.development";
import {Gallery} from "../gallery";
import {AuthenticationService} from "../authentication.service";
import {TripsDataService} from "../trips-data.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-add-gallery',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './add-gallery.component.html',
  styleUrl: './add-gallery.component.css'
})
export class AddGalleryComponent implements OnInit {

  @ViewChild(environment.forms.galleryForm)
  galleryForm!: NgForm;
  gallery!: Gallery;
  tripId!: string;

  createFailMessage: string = '';
  isCreateFail: boolean = false;

  constructor(private _authService: AuthenticationService, private _tripsService: TripsDataService, private _router: Router, private _activatedRouter: ActivatedRoute) {
    if (!this._authService.isLoggedIn()) {
      this._router.navigate([environment.urlFrontend.signIn]);
    }
  }

  ngOnInit(): void {
    // @ts-ignore
    this.gallery = new Gallery();
    this.tripId = this._activatedRouter.snapshot.params[environment.params.tripId];
  }

  create(): void {
    if (!this.isBlank()) {
      this._tripsService.addGallery(this.tripId, this.gallery).subscribe({
        next: (trip) => {
          this.createFailMessage = '';
          this.isCreateFail = false;
        },
        error: (error) => {
          this.createFailMessage = environment.message.createFailMessage;
          this.isCreateFail = true;
        },
        complete: () => {
          if (!this.isCreateFail) {
            this.createFailMessage = '';
            this.isCreateFail = false;
            this._router.navigate([`${environment.urlFrontend.trip}/${this.tripId}`]);
          }
        }
      });
    }
  }

  isBlank(): boolean {
    if (this.gallery.place === '' || this.gallery.picture === '') {
      this.createFailMessage = environment.message.filledInTheBlank;
      this.isCreateFail = true;
      return true;
    }
    return false;
  }
}

