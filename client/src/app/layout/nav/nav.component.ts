import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { LoginService } from '../../core/services/login-service.service';
import { Router, RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MessageBusService } from '../../core/services/message-bus.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})

export class NavComponent implements OnInit, OnDestroy {
  loginService = inject(LoginService);
  router = inject(Router);
  messageBusService = inject(MessageBusService);

  private destroy$ = new Subject<void>();

  protected profilePhotoUrl = signal<string | null>(null);

  environment = environment;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.messageBusService.onProfilePhotoChanged()
      .pipe(takeUntil(this.destroy$))
      .subscribe(newUrl => {
        this.profilePhotoUrl.set(newUrl);
      });   
  }


  logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/login');
  }

  login() {
    this.router.navigate(['/login']); 
  }

  refreshLogin() {
    this.loginService.refreshUserData();
  }

}
