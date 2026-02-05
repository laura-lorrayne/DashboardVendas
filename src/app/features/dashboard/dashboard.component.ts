import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { VendasService } from 'src/app/core/services/vendas.service';
import { VendaAgregada } from 'src/app/core/models/venda.model';
import { DetalheComponent } from './detalhe/detalhe.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  vendas: VendaAgregada[] = [];
  totalGeral = 0;
  produtoMaisVendido = '';
  chartData: any;
  chartOptions: any;

  bsModalRef?: BsModalRef;

  constructor(
    private vendasService: VendasService,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    const csvSalvo = localStorage.getItem('ultimo_csv');
    if (csvSalvo) {
      try {
        this.atualizarDashboard(
          this.vendasService.processarDadosString(csvSalvo),
        );
      } catch (e) {
        console.error('Erro ao carregar cache', e);
      }
    }
  }

  aoReceberDados(dados: VendaAgregada[]) {
    this.atualizarDashboard(dados);
  }

  aoReceberErro(mensagem: string) {
    alert('Erro: ' + mensagem);
  }

  atualizarDashboard(dados: VendaAgregada[]) {
    this.vendas = dados;
    this.totalGeral = this.vendas.reduce(
      (acc, curr) => acc + curr.valorTotal,
      0,
    );

    const campeao =
      this.vendas.length > 0
        ? this.vendas.reduce((prev, curr) =>
            prev.quantidadeTotal > curr.quantidadeTotal ? prev : curr,
          )
        : null;

    this.produtoMaisVendido = campeao ? campeao.produto : '-';

    this.chartData = {
      labels: this.vendas.map((v) => v.produto),
      datasets: [
        {
          label: 'Vendas',
          data: this.vendas.map((v) => v.quantidadeTotal),
          backgroundColor: '#3b82f6',
          hoverBackgroundColor: '#2563eb',
          borderRadius: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.8,
        },
      ],
    };

    this.chartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#1e293b',
          bodyColor: '#475569',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (ctx: any) => ` ${ctx.parsed.x} unidades`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: '#f1f5f9', borderDash: [5, 5], drawBorder: false },
          ticks: { color: '#64748b', font: { size: 11 } },
        },
        y: {
          grid: { display: false, drawBorder: false },
          ticks: { color: '#64748b', font: { size: 12, weight: '500' } },
        },
      },
    };
  }

  abrirDetalhes(produto: VendaAgregada) {
    const initialState = { venda: produto };
    this.bsModalRef = this.modalService.show(DetalheComponent, {
      initialState,
    });
  }
  carregarDoCache() {
    const csvSalvo = localStorage.getItem('ultimo_csv');

    if (csvSalvo) {
      try {
        console.log('Restaurando dados do localStorage...');
        const dados = this.vendasService.processarDadosString(csvSalvo);
        this.atualizarDashboard(dados);
      } catch (error) {
        console.error('CSV salvo inválido, limpando cache.');
        localStorage.removeItem('ultimo_csv');
      }
    }
  }
  limparDados() {
    localStorage.removeItem('ultimo_csv');
    this.vendas = [];
    window.location.reload();
  }
}
