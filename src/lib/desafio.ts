// Desafio Dev - logica dos 3 exercicios
// Feito por mim :)

export interface Venda {
  vendedor: string;
  valor: number;
}

// dados do json do enunciado
export const vendasData: Venda[] = [
  { vendedor: "João Silva", valor: 1200.5 },
  { vendedor: "João Silva", valor: 950.75 },
  { vendedor: "João Silva", valor: 1800.0 },
  { vendedor: "João Silva", valor: 1400.3 },
  { vendedor: "João Silva", valor: 1100.9 },
  { vendedor: "João Silva", valor: 1550.0 },
  { vendedor: "João Silva", valor: 1700.8 },
  { vendedor: "João Silva", valor: 250.3 },
  { vendedor: "João Silva", valor: 480.75 },
  { vendedor: "João Silva", valor: 320.4 },
  { vendedor: "Maria Souza", valor: 2100.4 },
  { vendedor: "Maria Souza", valor: 1350.6 },
  { vendedor: "Maria Souza", valor: 950.2 },
  { vendedor: "Maria Souza", valor: 1600.75 },
  { vendedor: "Maria Souza", valor: 1750.0 },
  { vendedor: "Maria Souza", valor: 1450.9 },
  { vendedor: "Maria Souza", valor: 400.5 },
  { vendedor: "Maria Souza", valor: 180.2 },
  { vendedor: "Maria Souza", valor: 90.75 },
  { vendedor: "Carlos Oliveira", valor: 800.5 },
  { vendedor: "Carlos Oliveira", valor: 1200.0 },
  { vendedor: "Carlos Oliveira", valor: 1950.3 },
  { vendedor: "Carlos Oliveira", valor: 1750.8 },
  { vendedor: "Carlos Oliveira", valor: 1300.6 },
  { vendedor: "Carlos Oliveira", valor: 300.4 },
  { vendedor: "Carlos Oliveira", valor: 500.0 },
  { vendedor: "Carlos Oliveira", valor: 125.75 },
  { vendedor: "Ana Lima", valor: 1000.0 },
  { vendedor: "Ana Lima", valor: 1100.5 },
  { vendedor: "Ana Lima", valor: 1250.75 },
  { vendedor: "Ana Lima", valor: 1400.2 },
  { vendedor: "Ana Lima", valor: 1550.9 },
  { vendedor: "Ana Lima", valor: 1650.0 },
  { vendedor: "Ana Lima", valor: 75.3 },
  { vendedor: "Ana Lima", valor: 420.9 },
  { vendedor: "Ana Lima", valor: 315.4 },
];

// EXERCICIO 1
// regra: < 100 nao gera comissao, < 500 paga 1%, >= 500 paga 5%
export function calcularComissao(valor: number): number {
  if (valor < 100) {
    return 0;
  } else if (valor < 500) {
    return valor * 0.01;
  } else {
    return valor * 0.05;
  }
}

export interface ComissaoVendedor {
  vendedor: string;
  totalVendas: number;
  totalComissao: number;
  quantidadeVendas: number;
}

// soma as comissoes agrupando por vendedor
export function comissoesPorVendedor(vendas: Venda[]): ComissaoVendedor[] {
  const resultado: ComissaoVendedor[] = [];

  for (const venda of vendas) {
    // procura se o vendedor ja esta na lista
    const existente = resultado.find((r) => r.vendedor === venda.vendedor);

    if (existente) {
      existente.totalVendas += venda.valor;
      existente.totalComissao += calcularComissao(venda.valor);
      existente.quantidadeVendas++;
    } else {
      // se nao achou, adiciona
      resultado.push({
        vendedor: venda.vendedor,
        totalVendas: venda.valor,
        totalComissao: calcularComissao(venda.valor),
        quantidadeVendas: 1,
      });
    }
  }

  return resultado;
}

// EXERCICIO 2
export interface Produto {
  codigoProduto: number;
  descricaoProduto: string;
  estoque: number;
}

export const estoqueInicial: Produto[] = [
  { codigoProduto: 101, descricaoProduto: "Caneta Azul", estoque: 150 },
  { codigoProduto: 102, descricaoProduto: "Caderno Universitário", estoque: 75 },
  { codigoProduto: 103, descricaoProduto: "Borracha Branca", estoque: 200 },
  { codigoProduto: 104, descricaoProduto: "Lápis Preto HB", estoque: 320 },
  { codigoProduto: 105, descricaoProduto: "Marcador de Texto Amarelo", estoque: 90 },
];

export interface Movimentacao {
  id: number; // numero identificador unico
  codigoProduto: number;
  descricao: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  estoqueFinal: number;
}

// EXERCICIO 3
// juros simples de 2,5% por dia de atraso
export function calcularJuros(valor: number, vencimento: Date, hoje: Date) {
  const umDiaEmMs = 1000 * 60 * 60 * 24;
  let diasAtraso = Math.floor((hoje.getTime() - vencimento.getTime()) / umDiaEmMs);

  // se ainda nao venceu, nao tem juros
  if (diasAtraso < 0) {
    diasAtraso = 0;
  }

  const juros = valor * 0.025 * diasAtraso;
  const total = valor + juros;

  return { diasAtraso, juros, total };
}

// formata numero pra real (R$)
export function formatBRL(v: number): string {
  return "R$ " + v.toFixed(2).replace(".", ",");
}
