import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUsersDialogComponent } from './delete-users-dialog.component';

describe('DeleteUsersDialogComponent', () => {
  let component: DeleteUsersDialogComponent;
  let fixture: ComponentFixture<DeleteUsersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUsersDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteUsersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
