import { Component } from '@angular/core';
import { UpdateProfileComponent } from "../update-profile/update-profile.component";

@Component({
  selector: 'app-profile',
  imports: [UpdateProfileComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
