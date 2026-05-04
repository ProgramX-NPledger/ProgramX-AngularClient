import { TestBed } from '@angular/core/testing';

import { ApplicationsHealthCheckServiceService } from './applications-health-check-service.service';

describe('ApplicationsHealthCheckServiceService', () => {
  let service: ApplicationsHealthCheckServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationsHealthCheckServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
