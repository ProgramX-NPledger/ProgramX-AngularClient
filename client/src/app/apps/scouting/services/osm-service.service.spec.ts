import { TestBed } from '@angular/core/testing';

import { OsmServiceService } from './osm-service.service';

describe('OsmServiceService', () => {
  let service: OsmServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OsmServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
