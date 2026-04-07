import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScoreledgerItemDialogComponent } from './create-scoreledger-item-dialog.component';

describe('CreateScoreledgerItemDialogComponent', () => {
  let component: CreateScoreledgerItemDialogComponent;
  let fixture: ComponentFixture<CreateScoreledgerItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateScoreledgerItemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateScoreledgerItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
