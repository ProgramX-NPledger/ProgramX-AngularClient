import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditApplicationDialogComponent } from './edit-application-dialog.component';

describe('EditApplicationDialogComponent', () => {
  let component: EditApplicationDialogComponent;
  let fixture: ComponentFixture<EditApplicationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditApplicationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditApplicationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
