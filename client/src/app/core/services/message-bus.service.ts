import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageBusService {
  private profilePhotoChanged$ = new BehaviorSubject<string | undefined>(undefined);

  // sender calls this
  notifyProfilePhotoChanged(newUrl: string) {
    this.profilePhotoChanged$.next(newUrl);
  }

  // receiver subscribes to this
  onProfilePhotoChanged(): Observable<string | undefined> {
    return this.profilePhotoChanged$.asObservable();
  }
}