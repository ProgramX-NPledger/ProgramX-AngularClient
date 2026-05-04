import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitInformationComponent } from './commit-information.component';

describe('CommitInformationComponent', () => {
  let component: CommitInformationComponent;
  let fixture: ComponentFixture<CommitInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommitInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
