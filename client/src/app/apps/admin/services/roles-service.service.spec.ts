import { TestBed } from '@angular/core/testing';

import { RolesService } from './roles-service.service';

describe('RolesServiceService', () => {
  let service: RolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
