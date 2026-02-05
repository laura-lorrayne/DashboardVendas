export interface Venda {
  produto: string;
  quantidade: number;
  precoUnitario: number;
}

export interface VendaAgregada {
  produto: string;
  quantidadeTotal: number;
  valorTotal: number;
}
