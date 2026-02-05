import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Venda, VendaAgregada } from '../models/venda.model';

@Injectable({
  providedIn: 'root',
})
export class VendasService {
  processarArquivoCSV(file: File): Observable<VendaAgregada[]> {
    const resultado = new Subject<VendaAgregada[]>();
    const reader = new FileReader();

    reader.onload = (event: any) => {
      try {
        const texto = event.target.result;
        const vendas = this.parseCSV(texto);
        const agregados = this.agregarVendas(vendas);
        resultado.next(agregados);
        resultado.complete();
      } catch (erro) {
        resultado.error(erro);
      }
    };

    reader.onerror = (error) => resultado.error(error);
    reader.readAsText(file);

    return resultado.asObservable();
  }

  processarDadosString(csvText: string): VendaAgregada[] {
    const vendas = this.parseCSV(csvText);
    return this.agregarVendas(vendas);
  }

  private parseCSV(csvText: string): Venda[] {
    const linhas = csvText.split('\n');
    const vendas: Venda[] = [];

    const header = linhas[0]?.toLowerCase() || '';
    if (!header.includes('produto') || !header.includes('quantidade')) {
      throw new Error(
        'Cabeçalho inválido. Use: produto, quantidade, preco_unitario',
      );
    }

    for (let i = 1; i < linhas.length; i++) {
      const colunas = linhas[i].split(',');
      if (colunas.length >= 3) {
        const produto = colunas[0].trim();
        const qtd = Number(colunas[1].trim());
        const preco = Number(colunas[2].trim());

        if (produto && !isNaN(qtd) && !isNaN(preco)) {
          vendas.push({ produto, quantidade: qtd, precoUnitario: preco });
        }
      }
    }
    return vendas;
  }

  private agregarVendas(vendas: Venda[]): VendaAgregada[] {
    const mapa = new Map<string, VendaAgregada>();

    vendas.forEach((v) => {
      if (mapa.has(v.produto)) {
        const item = mapa.get(v.produto)!;
        item.quantidadeTotal += v.quantidade;
        item.valorTotal += v.quantidade * v.precoUnitario;
      } else {
        mapa.set(v.produto, {
          produto: v.produto,
          quantidadeTotal: v.quantidade,
          valorTotal: v.quantidade * v.precoUnitario,
        });
      }
    });

    return Array.from(mapa.values());
  }
}
