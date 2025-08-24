import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UsersService } from '../apps/admin/services/users-service.service';
import { LoginService } from '../core/services/login-service.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-update-profile-photo',
  imports: [FormsModule],
  templateUrl: './update-profile-photo.component.html',
  styleUrl: './update-profile-photo.component.css'
})

export class UpdateProfilePhotoComponent {
  selectedFile: File | null = null;
  progress: number = 0;
  status: 'idle' | 'uploading' | 'done' | 'error' = 'idle';
  errorMessage = '';

  maxSizeBytes = 5 * 1024 * 1024; // 5 MB
  allowedTypes = ['image/png', 'image/jpeg', 'application/pdf']; // adjust as needed

  userService = inject(UsersService);
  loginService = inject(LoginService);

  isBusy = signal<boolean>(false);

  
  onFileSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      if (!input.files?.length) return;

      const list = Array.from(input.files);
      const accepted: File[] = [];
      const rejected: string[] = [];

      for (const f of list) {
        const typeOk = this.allowedTypes.length === 0 || this.allowedTypes.includes(f.type);
        const sizeOk = f.size <= this.maxSizeBytes;
        if (typeOk && sizeOk) {
          accepted.push(f);
        } else {
          rejected.push(`${f.name} (${!typeOk ? 'type' : ''}${!typeOk && !sizeOk ? ' & ' : ''}${!sizeOk ? 'size' : ''})`);
        }
      }

      this.selectedFile = accepted[0] || null;
      this.errorMessage = rejected.length ? `Rejected: ${rejected.join(', ')}` : '';
      this.progress = 0;
      this.status = 'idle';
    }

    
  updateProfilePhoto(form: NgForm) {
     if (!this.selectedFile) return;

    this.status = 'uploading';
    this.progress = 0;
    this.errorMessage = '';
    this.isBusy.set(true);

    this.userService.updateUserProfilePhoto(this.loginService.currentUser()!.userName, this.selectedFile).subscribe({
      next: event => {
        if (event.httpEventType === HttpEventType.UploadProgress && event.totalBytesToTransfer && event.bytesTransferred) {
          this.progress = Math.round((100 * event.bytesTransferred) / event.totalBytesToTransfer);
        } else if (event.httpEventType === HttpEventType.Response) {
          this.isBusy.set(false);
          this.status = 'done';
        }
      },
      error: err => {
        this.isBusy.set(false);
        this.status = 'error';
        this.errorMessage = 'Upload failed.';
        console.error(err);
      }
    });
  }

  removeProfilePhoto() {

  }

}
