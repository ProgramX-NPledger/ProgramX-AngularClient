import { Component } from '@angular/core';
import { UpdateProfilePhotoComponent } from "../update-profile-photo/update-profile-photo.component";
import { ChangePasswordComponent } from "../change-password/change-password.component";
import {UpdateProfileComponent} from '../shell/components/update-profile/update-profile.component';

@Component({
  selector: 'app-profile',
  imports: [UpdateProfileComponent, UpdateProfilePhotoComponent, ChangePasswordComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
onProfilePhotoChanged() {
  window.location.reload();
}

}
