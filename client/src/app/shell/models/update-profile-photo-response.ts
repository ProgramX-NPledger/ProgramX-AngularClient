import {HttpEventType} from '@angular/common/http';

export interface UpdateProfilePhotoResponse  {
  httpEventType: HttpEventType;
  totalBytesToTransfer: number;
  bytesTransferred: number;
  photoUrl: string;

}
