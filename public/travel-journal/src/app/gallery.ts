import {NgForm} from "@angular/forms";

export class Gallery{
  #_id!:string;
  #picture!:string;
  #place!:string;

  constructor(picture:string, place:string){
    this.#picture=picture;
    this.#place=place;
  }

  get _id(): string {
    return this.#_id;
  }

  set _id(value: string) {
    this.#_id = value;
  }

  get picture(): string {
    return this.#picture;
  }

  set picture(value: string) {
    this.#picture = value;
  }


  set place(value: string) {
    this.#place = value;
  }

  get place(): string{
    return this.#place;
  }

  fill(form: NgForm) {
    this._id = form.value.id;
    this.picture = form.value.picture;
    this.place = form.value.place;
  }
  jsonify() {
    return {
      picture: this.picture,
      place: this.place,
    }
  }

}
