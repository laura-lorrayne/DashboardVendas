import { TestBed } from '@angular/core/testing';
import { VendasService } from './vendas.service';
import { VendaAgregada } from '../models/venda.model';

class MockFileReader {
  onload: (e: any) => void = () => {};
  onerror: (e: any) => void = () => {};

  readAsText(file: any) {}
}

describe('VendasService', () => {
  let service: VendasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendasService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('Lógica Síncrona (processarDadosString)', () => {
    it('deve realizar o parse e agregação corretamente (Caminho Feliz)', () => {
      const csvMock = `produto,quantidade,preco_unitario
      Mouse, 1, 10
      Mouse, 2, 10
      Teclado, 1, 50`;

      const resultado = service.processarDadosString(csvMock);

      expect(resultado.length).toBe(2);

      const mouse = resultado.find((v) => v.produto === 'Mouse');
      expect(mouse).toBeDefined();
      expect(mouse?.quantidadeTotal).toBe(3);
      expect(mouse?.valorTotal).toBe(30);

      const teclado = resultado.find((v) => v.produto === 'Teclado');
      expect(teclado?.valorTotal).toBe(50);
    });

    it('deve lançar erro se o cabeçalho for inválido', () => {
      const csvInvalido = `nome,qtd,valor\nA,1,10`;

      expect(() => {
        service.processarDadosString(csvInvalido);
      }).toThrowError(/Cabeçalho inválido/);
    });

    it('deve ignorar linhas vazias ou mal formatadas', () => {
      const csvSujo = `produto,quantidade,preco_unitario
      Mouse, 1, 10

      ,,
      Teclado, 1, 50`;

      const resultado = service.processarDadosString(csvSujo);

      expect(resultado.length).toBe(2);
    });
  });

  describe('Lógica Assíncrona (processarArquivoCSV)', () => {
    let mockReader: MockFileReader;

    beforeEach(() => {
      mockReader = new MockFileReader();
      spyOn(window as any, 'FileReader').and.returnValue(mockReader);
    });

    it('deve retornar Observable com dados agregados em caso de sucesso', (done) => {
      const file = new File([''], 'teste.csv');
      const csvConteudo = `produto,quantidade,preco_unitario
      Caneta, 10, 2`;

      service.processarArquivoCSV(file).subscribe({
        next: (dados: VendaAgregada[]) => {
          expect(dados.length).toBe(1);
          expect(dados[0].produto).toBe('Caneta');
          expect(dados[0].valorTotal).toBe(20);
          done();
        },
        error: () => fail('Não deveria dar erro'),
      });

      mockReader.onload({ target: { result: csvConteudo } });
    });

    it('deve retornar erro no Observable se o CSV for inválido (Erro de Parse)', (done) => {
      const file = new File([''], 'errado.csv');
      const conteudoInvalido = `cabecalho,errado
      A,1,1`;

      service.processarArquivoCSV(file).subscribe({
        next: () => fail('Deveria ter dado erro'),
        error: (erro) => {
          expect(erro.message).toContain('Cabeçalho inválido');
          done();
        },
      });

      mockReader.onload({ target: { result: conteudoInvalido } });
    });

    it('deve retornar erro no Observable se o FileReader falhar (Erro de Leitura)', (done) => {
      const file = new File([''], 'erro_leitura.csv');
      const erroLeitura = new Error('Disco cheio');

      service.processarArquivoCSV(file).subscribe({
        next: () => fail('Deveria ter dado erro'),
        error: (erro) => {
          expect(erro).toBe(erroLeitura);
          done();
        },
      });

      mockReader.onerror(erroLeitura);
    });
  });
});
