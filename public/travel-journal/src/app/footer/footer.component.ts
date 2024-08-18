import {Component} from '@angular/core';
import {environment} from "../../environments/environment.development";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  developer: string = environment.projectDetails.developer;
  footerText: string = environment.projectDetails.footerText;
  profileLink: string = environment.projectDetails.profileLink;
}
