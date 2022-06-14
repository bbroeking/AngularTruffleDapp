import { TestBed } from '@angular/core/testing';

import { FlootContractService } from './floot-contract.service';

describe('FlootContractService', () => {
  let service: FlootContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlootContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
