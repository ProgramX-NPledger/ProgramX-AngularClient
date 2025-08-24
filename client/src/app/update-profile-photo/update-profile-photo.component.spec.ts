import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfilePhotoComponent } from './update-profile-photo.component';

describe('UpdateProfilePhotoComponent', () => {
  let component: UpdateProfilePhotoComponent;
  let fixture: ComponentFixture<UpdateProfilePhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProfilePhotoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProfilePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
