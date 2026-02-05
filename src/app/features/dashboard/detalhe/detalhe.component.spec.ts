import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalheComponent } from './detalhe.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { VendaAgregada } from 'src/app/core/models/venda.model';

describe('DetalheComponent', () => {
  let component: DetalheComponent;
  let fixture: ComponentFixture<DetalheComponent>;
  let bsModalRefSpy: jasmine.SpyObj<BsModalRef>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('BsModalRef', ['hide']);

    await TestBed.configureTestingModule({
      declarations: [DetalheComponent],
      providers: [{ provide: BsModalRef, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheComponent);
    component = fixture.componentInstance;
    bsModalRefSpy = TestBed.inject(BsModalRef) as jasmine.SpyObj<BsModalRef>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
    expect(component.bsModalRef).toBeDefined();
  });

  it('deve aceitar e exibir os dados de venda (Simulação de initialState)', () => {
    const mockVenda: VendaAgregada = {
      produto: 'Notebook Gamer',
      quantidadeTotal: 2,
      valorTotal: 5000.0,
    };

    component.venda = mockVenda;
    fixture.detectChanges();

    expect(component.venda).toEqual(mockVenda);
    expect(component.venda?.produto).toBe('Notebook Gamer');

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Notebook Gamer');
  });

  it('deve permitir chamar o método hide do modalRef', () => {
    component.bsModalRef.hide();

    expect(bsModalRefSpy.hide).toHaveBeenCalled();
  });
});
