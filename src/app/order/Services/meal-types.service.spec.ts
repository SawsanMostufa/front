import { TestBed } from '@angular/core/testing';

import { MealTypesService } from './meal-types.service';

describe('MealTypesService', () => {
  let service: MealTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
