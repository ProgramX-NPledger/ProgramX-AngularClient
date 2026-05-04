import { TestBed } from '@angular/core/testing';

import { BuildServiceService } from './build-service.service';

describe('BuildServiceService', () => {
  let service: BuildServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
