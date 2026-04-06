import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoresLedgerComponent } from './scores-ledger.component';

describe('ScoresLedgerComponent', () => {
  let component: ScoresLedgerComponent;
  let fixture: ComponentFixture<ScoresLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoresLedgerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoresLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
