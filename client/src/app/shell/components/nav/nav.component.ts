import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Subject, takeUntil } from 'rxjs';
import {JsonPipe} from '@angular/common';
import {ApplicationsService} from '../../../core/services/applications.service';
import {LoginService} from '../../../core/services/login-service.service';
import {MessageBusService} from '../../../core/services/message-bus.service';
import {Application} from '../../../core/models/application';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, JsonPipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})

export class NavComponent implements OnInit, OnDestroy {
  loginService: LoginService = inject(LoginService);
  applicationsService = inject(ApplicationsService);
  router = inject(Router);
  messageBusService: MessageBusService = inject(MessageBusService);

  private destroy$ = new Subject<void>();

  protected profilePhotoUrl = signal<string | null>(null);
  protected isLoadingApplications = signal<boolean>(false);
  protected applications = signal<Application[]>([]);

  environment = environment;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.messageBusService.onProfilePhotoChanged()
      .pipe(takeUntil(this.destroy$))
      .subscribe((newUrl: string | null) => {
        this.profilePhotoUrl.set(newUrl);
      });

    this.loadApplicationNavigation();
  }

  private loadApplicationNavigation() {
    this.isLoadingApplications.set(true);
    if (this.loginService.currentUser()) {
      try {
        this.applicationsService.getApplicationsForRoles(this.loginService.currentUser()!.memberOfRoles).subscribe(applications => {
          this.applications.set(applications);
          this.isLoadingApplications.set(false);
        });
      } catch (error) {
        this.isLoadingApplications.set(false);
        console.error('Error loading applications:', error);
      }
    } else {
      this.applications.set([]);
      this.isLoadingApplications.set(false);
    }
  }


  logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/login');
  }

  login() {
    this.router.navigate(['/login']);
  }



}
