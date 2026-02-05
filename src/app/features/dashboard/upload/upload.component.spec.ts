import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadComponent } from './upload.component';
import { VendasService } from 'src/app/core/services/vendas.service';
import { VendaAgregada } from 'src/app/core/models/venda.model';

class MockFileReader {
  onload: (e: any) => void = () => {};
  onerror: (e: any) => void = () => {};
  readAsText(_: any) {}
}

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let vendasServiceSpy: jasmine.SpyObj<VendasService>;

  let mockReaderInstance: MockFileReader;

  beforeEach(async () => {
    mockReaderInstance = new MockFileReader();
    const vServiceSpy = jasmine.createSpyObj('VendasService', [
      'processarDadosString',
    ]);

    await TestBed.configureTestingModule({
      declarations: [UploadComponent],
      providers: [{ provide: VendasService, useValue: vServiceSpy }],
    }).compileComponents();

    vendasServiceSpy = TestBed.inject(
      VendasService,
    ) as jasmine.SpyObj<VendasService>;
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;

    spyOn(window as any, 'FileReader').and.returnValue(mockReaderInstance);

    spyOn(localStorage, 'setItem');

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve processar o arquivo corretamente (Caminho Feliz)', () => {
    const mockFile = new File(['produto,qtd,valor'], 'vendas.csv', {
      type: 'text/csv',
    });
    const mockEvent = { target: { files: [mockFile] } };
    const mockResultado: VendaAgregada[] = [
      { produto: 'A', quantidadeTotal: 1, valorTotal: 10 },
    ];
    const csvConteudo = 'conteudo,do,csv';

    vendasServiceSpy.processarDadosString.and.returnValue(mockResultado);

    spyOn(component.dadosCarregados, 'emit');

    component.onFileSelected(mockEvent);

    mockReaderInstance.onload({ target: { result: csvConteudo } });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'ultimo_csv',
      csvConteudo,
    );
    expect(vendasServiceSpy.processarDadosString).toHaveBeenCalledWith(
      csvConteudo,
    );
    expect(component.dadosCarregados.emit).toHaveBeenCalledWith(mockResultado);
  });

  it('deve emitir erro se o serviço falhar ao processar (ex: CSV inválido)', () => {
    const mockFile = new File([''], 'errado.csv');
    const mockEvent = { target: { files: [mockFile] } };
    const erroMsg = 'Formato inválido';

    vendasServiceSpy.processarDadosString.and.throwError(erroMsg);

    spyOn(component.erroUpload, 'emit');

    component.onFileSelected(mockEvent);

    mockReaderInstance.onload({ target: { result: 'texto,inválido' } });

    expect(component.erroUpload.emit).toHaveBeenCalledWith(erroMsg);
  });

  it('deve emitir erro se o FileReader falhar na leitura', () => {
    const mockFile = new File([''], 'teste.csv');
    const mockEvent = { target: { files: [mockFile] } };

    spyOn(component.erroUpload, 'emit');

    component.onFileSelected(mockEvent);

    mockReaderInstance.onerror({});

    expect(component.erroUpload.emit).toHaveBeenCalledWith(
      'Erro ao ler o arquivo.',
    );
  });

  it('não deve fazer nada se nenhum arquivo for selecionado', () => {
    const mockEventVazio = { target: { files: [] } };

    const spyRead = spyOn(mockReaderInstance, 'readAsText');

    component.onFileSelected(mockEventVazio);

    expect(spyRead).not.toHaveBeenCalled();
  });
});
