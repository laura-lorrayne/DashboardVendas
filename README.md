# 📊 Desafio Dashboard - Analytics de Vendas

Este projeto é uma **Single Page Application (SPA)** desenvolvida em **Angular 13** para visualização e análise de dados de vendas. O sistema permite o upload de arquivos CSV, processa os dados localmente no navegador e exibe métricas consolidadas, gráficos interativos e tabelas detalhadas.

---

## 🚀 Funcionalidades

* **Upload de Arquivo CSV:** Leitura e processamento manual de arquivos `.csv` via `FileReader` .
* **Dashboard Interativo:**
* **Cards de Resumo:** Exibição do Total Geral e do Produto Mais Vendido.
* **Gráfico de Barras:** Visualização de vendas por quantidade (integração **Chart.js**).
* **Tabela Detalhada:** Ordenação, paginação e **filtro global** de busca.


* **Persistência de Dados:** Uso do `localStorage` para manter os dados após recarregar a página (F5).
* **Modal de Detalhes:** Visualização expandida de cada item da venda.
* **Resiliência:** Tratamento de erros para arquivos corrompidos ou cabeçalhos inválidos.

---

## ♿ Acessibilidade e Inclusão

A aplicação foi projetada com foco em acessibilidade digital:

* **Validação com Leitores de Tela:** Testes realizados utilizando o software **JAWS (Job Access With Speech)** para garantir que a navegação, alertas e tabelas sejam interpretados corretamente.
* **Semântica HTML:** Uso de landmarks, labels associados e atributos `aria` onde necessário.
* **Navegação:** Suporte total à navegação via teclado (Tabulação lógica) e via setas ( detalhado).

---

## 🛠️ Tecnologias Utilizadas

Baseado nas dependências do projeto (`package.json`):

* **Framework:** Angular 13.
* **Gerenciador de Pacotes:** NPM.
* **UI & Layout:**
* Bootstrap 4.6 (Grid System).
* PrimeNG 13 (Componentes ricos: Table, Charts, InputText).
* SCSS (Estilização customizada "clean").


* **Visualização:** Chart.js 3.
* **Testes:** Jasmine & Karma.

---

## ⚙️ Instalação e Execução

### Pré-requisitos

* **Node.js:** Versão **v14.x** ou **v16.x** (Recomendado para compatibilidade com Angular 13).
* **Angular CLI:** `npm install -g @angular/cli@13`.

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/laura-lorrayne/DashboardVendas.git
cd DashboardVendas

```


2. **Instale as dependências:**
Utilize o npm para instalar os pacotes listados no `package.json`:
```bash
npm install
# Caso encontre erros de conflito de versões, utilize:
# npm install --legacy-peer-deps

```


3. **Executando o Projeto:**
Para iniciar o servidor de desenvolvimento:
```bash
ng serve
# ou
npm start

```


Acesse no navegador: `http://localhost:4200`

---

## ✅ Testes Unitários

O projeto possui alta cobertura de testes, validando desde a lógica matemática até interações de UI. Para executar a suíte de testes:

```bash
ng test

```


## 📂 Estrutura do Projeto

```bash
src/app/
├── core/                        # Singleton services, modelos e lógica global
│   ├── models/
│   │   └── venda.model.ts      # Interface que define a estrutura do dado de venda
│   └── services/
│       └── vendas.service.ts   # Lógica de parse do CSV e cálculos matemáticos
│
├── features/                    # Módulos de funcionalidades principais
│   ├── dashboard/
│   │   ├── dashboard.module.ts # Declarações e importações do módulo de dashboard
│   │   └── dashboard.component.ts # Orquestrador da exibição dos dados e gráficos
│   │
│   ├── upload/
│   │   └── upload.component.ts # Lógica de recebimento e leitura do arquivo CSV
│   │
│   └── detalhe/
│       └── detalhe.component.ts # Componente de visualização expandida (Modal)
│
└── shared/                      # Componentes, pipes e diretivas reutilizáveis
    ├── pipes/
    │   └── currency-br.pipe.ts # Formatação de moeda para o padrão Real (R$)
    │
    └── components/
        └── page-header/        # Cabeçalho padronizado para as páginas

```

## 📝 Formato do CSV para Teste

O arquivo deve conter um cabeçalho e dados separados por vírgula. As colunas **produto** e **quantidade** são obrigatórias.

```csv
produto, quantidade, preco_unitario
Camiseta Básica, 5, 49.90
Calça Jeans, 2, 129.90
Tênis Esportivo, 1, 299.90
Meia Algodão, 10, 15.50
Boné Aba Reta, 3, 35.00
Jaqueta de Couro, 1, 450.00
Relógio Digital, 1, 899.00
Camiseta Básica, 3, 49.90
Tênis Esportivo, 2, 299.90
Bermuda Cargo, 4, 79.90
Chinelo Slide, 5, 25.00
Mochila Escolar, 1, 150.00
Carteira de Couro, 2, 60

```

---

**Desenvolvido por Laura Lorrayne.**
