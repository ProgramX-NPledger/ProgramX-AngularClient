import { TestBed } from '@angular/core/testing';

import { HealthCheckServiceService } from './health-check-service.service';

describe('HealthCheckServiceService', () => {
  let service: HealthCheckServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthCheckServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
