import {Component, OnInit} from '@angular/core';
import { TripsDataService} from "../trips-data.service";
import {CommonModule, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Trip} from "../trip";
import {environment} from "../../environments/environment.development";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {
  title: string = environment.projectDetails.name;
  description: string = environment.projectDetails.description;
}

