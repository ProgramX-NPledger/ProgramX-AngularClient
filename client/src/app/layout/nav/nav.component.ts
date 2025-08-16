import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../core/services/login-service.service';

@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent  {
  loginService = inject(LoginService);

 

}
