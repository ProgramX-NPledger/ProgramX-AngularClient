
import {HttpEventType} from '@angular/common/http';

export interface UpdateProfilePhotoResponse {
  photoUrl: string
  httpEventType: HttpEventType;
  totalBytesToTransfer: number;
  bytesTransferred: number;
}
