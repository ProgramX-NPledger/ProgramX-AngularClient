import { Component } from '@angular/core';
import { UpdateProfilePhotoComponent } from "../update-profile-photo/update-profile-photo.component";
import {UpdateProfileComponent} from '../shell/components/update-profile/update-profile.component';
import {ChangePasswordComponent} from '../shell/components/change-password/change-password.component';

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
