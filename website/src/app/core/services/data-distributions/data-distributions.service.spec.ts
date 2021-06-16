import { TestBed } from '@angular/core/testing';

import { DataDistributionsService } from './data-distributions.service';

describe('DataDistributionsService', () => {
  let service: DataDistributionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataDistributionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
