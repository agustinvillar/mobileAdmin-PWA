import { TestBed } from '@angular/core/testing';

import { SelectStoreGuard } from './select-store.guard';

describe('SelectStoreGuard', () => {
  let guard: SelectStoreGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SelectStoreGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
