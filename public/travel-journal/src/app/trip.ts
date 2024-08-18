import {Gallery} from "./gallery";
import {NgForm} from "@angular/forms";

export class Trip {
  #_id!: string;
  #country!: string;
  #airport!: string;
  #hotel!: string;
  #gallery!: Gallery[];

  get _id(): string {
    return this.#_id;
  }

  get gallery(): Gallery[] {
    return this.#gallery;
  }

  get country(): string {
    return this.#country;
  }

  get airport(): string {
    return this.#airport;
  }

  get hotel(): string {
    return this.#hotel;
  }


  set _id(value: string) {
    this.#_id = value;
  }

  set country(value: string) {
    this.#country = value;
  }

  set airport(value: string) {
    this.#airport = value;
  }

  set hotel(value: string) {
    this.#hotel = value;
  }

  set gallery(value: Gallery[]) {
    this.#gallery = value;
  }

  fill(form: NgForm) {
    this._id = form.value.id;
    this.country = form.value.country;
    this.airport = form.value.airport;
    this.hotel = form.value.hotel;
    this.gallery = [];
  }

  jsonify() {
    return {
      country: this.country,
      airport: this.airport,
      hotel: this.hotel,
    }
  }

  constructor(id: string, country: string, airport: string, hotel: string, gallary: [Gallery]) {
    this.#_id = id;
    this.#country = country;
    this.#airport = airport;
    this.#hotel = hotel;
    this.#gallery = gallary;
  }

}
