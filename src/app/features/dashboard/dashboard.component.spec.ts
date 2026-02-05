import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { VendasService } from 'src/app/core/services/vendas.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VendaAgregada } from 'src/app/core/models/venda.model';

const MOCK_VENDAS: VendaAgregada[] = [
  { produto: 'Produto A', quantidadeTotal: 10, valorTotal: 100 },
  { produto: 'Produto B', quantidadeTotal: 20, valorTotal: 400 },
  { produto: 'Produto C', quantidadeTotal: 5, valorTotal: 50 },
];

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let vendasServiceSpy: jasmine.SpyObj<VendasService>;
  let modalServiceSpy: jasmine.SpyObj<BsModalService>;

  beforeEach(async () => {
    const vServiceSpy = jasmine.createSpyObj('VendasService', [
      'processarDadosString',
    ]);
    const mServiceSpy = jasmine.createSpyObj('BsModalService', ['show']);

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: VendasService, useValue: vServiceSpy },
        { provide: BsModalService, useValue: mServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    vendasServiceSpy = TestBed.inject(
      VendasService,
    ) as jasmine.SpyObj<VendasService>;
    modalServiceSpy = TestBed.inject(
      BsModalService,
    ) as jasmine.SpyObj<BsModalService>;

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit (Cache)', () => {
    it('deve carregar dados do localStorage se existir CSV salvo', () => {
      const csvMock = 'produto,qtd,valor\nA,1,10';
      spyOn(localStorage, 'getItem').and.returnValue(csvMock);
      vendasServiceSpy.processarDadosString.and.returnValue(MOCK_VENDAS);

      component.ngOnInit();

      expect(localStorage.getItem).toHaveBeenCalledWith('ultimo_csv');
      expect(vendasServiceSpy.processarDadosString).toHaveBeenCalledWith(
        csvMock,
      );
      expect(component.vendas.length).toBe(3);
      expect(component.totalGeral).toBe(550);
    });

    it('não deve fazer nada se o localStorage estiver vazio', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      component.ngOnInit();

      expect(vendasServiceSpy.processarDadosString).not.toHaveBeenCalled();
      expect(component.vendas.length).toBe(0);
    });
  });

  describe('Lógica de Negócio (atualizarDashboard)', () => {
    beforeEach(() => {
      component.atualizarDashboard(MOCK_VENDAS);
    });

    it('deve calcular o Total Geral corretamente', () => {
      expect(component.totalGeral).toEqual(550);
    });

    it('deve identificar o Produto Mais Vendido (baseado em quantidade)', () => {
      expect(component.produtoMaisVendido).toEqual('Produto B');
    });

    it('deve configurar os dados do gráfico (chartData) corretamente', () => {
      expect(component.chartData.labels).toEqual([
        'Produto A',
        'Produto B',
        'Produto C',
      ]);
      expect(component.chartData.datasets[0].data).toEqual([10, 20, 5]);
    });
  });

  describe('Interações de UI', () => {
    it('aoReceberErro deve disparar um alert', () => {
      spyOn(window, 'alert');
      const msg = 'Arquivo inválido';

      component.aoReceberErro(msg);

      expect(window.alert).toHaveBeenCalledWith('Erro: ' + msg);
    });

    it('abrirDetalhes deve chamar o modalService', () => {
      const item = MOCK_VENDAS[0];
      component.abrirDetalhes(item);

      expect(modalServiceSpy.show).toHaveBeenCalled();
      const args = modalServiceSpy.show.calls.mostRecent().args;
      expect(args[1]?.initialState).toEqual({ venda: item });
    });

    it('limparDados deve remover item do localStorage e recarregar a página', () => {
      const reloadSpy = spyOn(component, 'reloadPagina').and.stub();

      spyOn(localStorage, 'removeItem');

      component.limparDados();

      expect(localStorage.removeItem).toHaveBeenCalledWith('ultimo_csv');
      expect(component.vendas.length).toBe(0);

      expect(reloadSpy).toHaveBeenCalled();
    });
  });
});
