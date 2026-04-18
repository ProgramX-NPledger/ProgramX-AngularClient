import { TestBed } from '@angular/core/testing';

import { ScoutingService } from './scouting.service';

describe('ScoutingService', () => {
  let service: ScoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
