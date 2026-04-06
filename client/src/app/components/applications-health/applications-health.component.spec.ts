import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsHealthComponent } from './applications-health.component';

describe('ApplicationsHealthComponent', () => {
  let component: ApplicationsHealthComponent;
  let fixture: ComponentFixture<ApplicationsHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationsHealthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationsHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
