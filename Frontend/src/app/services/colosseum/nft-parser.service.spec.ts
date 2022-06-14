import { TestBed } from '@angular/core/testing';

import { NftParserService } from './nft-parser.service';

describe('NftParserService', () => {
  let service: NftParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NftParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
