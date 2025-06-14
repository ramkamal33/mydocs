// src/app/services/refresh.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  // Private subject to emit refresh events
  private refreshSubject = new Subject<void>();

  // Observable that components can subscribe to
  refresh$ = this.refreshSubject.asObservable();

  // Method to trigger a refresh event
  triggerRefresh() {
    this.refreshSubject.next();
  }
}
