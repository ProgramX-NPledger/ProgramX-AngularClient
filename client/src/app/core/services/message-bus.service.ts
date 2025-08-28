import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageBusService {
  private profilePhotoChanged$ = new BehaviorSubject<string | null>(null);

  // sender calls this
  notifyProfilePhotoChanged(newUrl: string | null) {
    this.profilePhotoChanged$.next(newUrl);
  }

  // receiver subscribes to this
  onProfilePhotoChanged(): Observable<string | null> {
    console.log('MessageBusService: onProfilePhotoChanged called');
    return this.profilePhotoChanged$.asObservable();
  }
}