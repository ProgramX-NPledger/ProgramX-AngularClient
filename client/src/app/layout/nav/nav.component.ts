import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../core/services/login-service.service';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent  {
  loginService = inject(LoginService);

 

}
