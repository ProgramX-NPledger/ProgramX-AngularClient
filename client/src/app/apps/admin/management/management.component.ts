import {Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrl: './management.component.css',
  standalone: false
})
export class ManagementComponent implements OnInit {

  constructor() {
    console.log('Management Component Initialized');
  }

  ngOnInit(): void {
    // Initialization logic can go here

  }




}
