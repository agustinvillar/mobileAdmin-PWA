import { TestBed } from '@angular/core/testing';

import { CommonCodeService } from './common-code.service';

describe('CommonCodeService', () => {
  let service: CommonCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
