import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../apps/admin/services/users-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-profile',
  imports: [FormsModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css'
})
export class UpdateProfileComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  isUnauthorised = signal<boolean>(false);
  
  ngOnInit(): void {
    console.log('UpdateProfileComponent initialized');
    const userName: string = this.activatedRoute!.snapshot.paramMap.get('id')?.toString() ?? '';
    this.usersService.getUser(userName).subscribe(user => {
      if (!user || !user.user) {
        this.isUnauthorised.set(true);
      } else {
        this.userName = user.user.userName;
        this.firstName = user.user.firstName;
        this.lastName = user.user.lastName;
        this.emailAddress = user.user.emailAddress;

      }
    });
  }

  private usersService = inject(UsersService);

  protected userName: string = '';
  protected firstName: string = '';
  protected lastName: string = '';
  protected emailAddress: string = '';

  updateProfile() {
    throw new Error('Method not implemented.');
  }

}
