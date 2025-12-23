import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRolesDialogComponent } from './delete-roles-dialog.component';

describe('DeleteRolesDialogComponent', () => {
  let component: DeleteRolesDialogComponent;
  let fixture: ComponentFixture<DeleteRolesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRolesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRolesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
