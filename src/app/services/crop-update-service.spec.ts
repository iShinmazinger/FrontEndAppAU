import { TestBed } from '@angular/core/testing';

import { CropUpdateService } from './crop-update-service';

describe('CropUpdateService', () => {
  let service: CropUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CropUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
