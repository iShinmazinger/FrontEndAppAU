import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropUpdate } from './crop-update';

describe('CropUpdate', () => {
  let component: CropUpdate;
  let fixture: ComponentFixture<CropUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
