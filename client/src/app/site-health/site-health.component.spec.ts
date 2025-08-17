import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteHealthComponent } from './site-health.component';

describe('SiteHealthComponent', () => {
  let component: SiteHealthComponent;
  let fixture: ComponentFixture<SiteHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHealthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
