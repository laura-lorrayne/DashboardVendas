/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VendasService } from './vendas.service';

describe('Service: Vendas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendasService]
    });
  });

  it('should ...', inject([VendasService], (service: VendasService) => {
    expect(service).toBeTruthy();
  }));
});
