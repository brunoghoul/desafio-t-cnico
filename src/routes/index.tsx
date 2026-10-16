import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  vendasData,
  comissoesPorVendedor,
  calcularComissao,
  estoqueInicial,
  calcularJuros,
  formatBRL,
  type Movimentacao,
  type Produto,
} from "@/lib/desafio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Desafio Dev" },
      { name: "description", content: "Resolução do desafio: comissão de vendas, estoque e juros." },
      { property: "og:title", content: "Desafio Dev" },
      { property: "og:description", content: "Resolução do desafio: comissão de vendas, estoque e juros." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground">Desafio Dev</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resolução dos 3 exercícios: comissão, estoque e juros.
        </p>

        <div className="mt-8 space-y-10">
          <Exercicio1 />
          <Exercicio2 />
          <Exercicio3 />
        </div>
      </div>
    </div>
  );
}

// ===================== EXERCICIO 1 - COMISSAO =====================

function Exercicio1() {
  const resumo = comissoesPorVendedor(vendasData);
  const [mostrarTudo, setMostrarTudo] = useState(false);

  return (
    <div>
      <h2 className="border-b border-border pb-1 text-lg font-bold text-foreground">
        1) Comissão de vendas
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Regra: abaixo de R$100 não gera comissão, abaixo de R$500 paga 1%, a partir de R$500 paga 5%.
      </p>

      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr className="border border-border bg-muted">
            <th className="border border-border px-2 py-1 text-left font-medium">Vendedor</th>
            <th className="border border-border px-2 py-1 text-right font-medium">Qtd. vendas</th>
            <th className="border border-border px-2 py-1 text-right font-medium">Total vendido</th>
            <th className="border border-border px-2 py-1 text-right font-medium">Comissão</th>
          </tr>
        </thead>
        <tbody>
          {resumo.map((r) => (
            <tr key={r.vendedor}>
              <td className="border border-border px-2 py-1">{r.vendedor}</td>
              <td className="border border-border px-2 py-1 text-right">{r.quantidadeVendas}</td>
              <td className="border border-border px-2 py-1 text-right">{formatBRL(r.totalVendas)}</td>
              <td className="border border-border px-2 py-1 text-right font-bold">
                {formatBRL(r.totalComissao)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => setMostrarTudo(!mostrarTudo)}
        className="mt-3 border border-input bg-background px-3 py-1 text-sm hover:bg-accent"
      >
        {mostrarTudo ? "Esconder detalhes" : "Mostrar venda por venda"}
      </button>

      {mostrarTudo && (
        <table className="mt-3 w-full border-collapse text-sm">
          <thead>
            <tr className="border border-border bg-muted">
              <th className="border border-border px-2 py-1 text-left font-medium">Vendedor</th>
              <th className="border border-border px-2 py-1 text-right font-medium">Valor</th>
              <th className="border border-border px-2 py-1 text-right font-medium">Comissão</th>
            </tr>
          </thead>
          <tbody>
            {vendasData.map((v, i) => (
              <tr key={i}>
                <td className="border border-border px-2 py-1">{v.vendedor}</td>
                <td className="border border-border px-2 py-1 text-right">{formatBRL(v.valor)}</td>
                <td className="border border-border px-2 py-1 text-right">
                  {formatBRL(calcularComissao(v.valor))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ===================== EXERCICIO 2 - ESTOQUE =====================

function Exercicio2() {
  const [produtos, setProdutos] = useState<Produto[]>(estoqueInicial);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [proximoId, setProximoId] = useState(1);

  const [codigo, setCodigo] = useState(101);
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");
  const [quantidade, setQuantidade] = useState(1);
  const [descricao, setDescricao] = useState("");
  const [mensagem, setMensagem] = useState("");

  function lancar() {
    const produto = produtos.find((p) => p.codigoProduto === codigo);
    if (!produto) return;

    if (quantidade <= 0) {
      setMensagem("Quantidade inválida.");
      return;
    }
    if (tipo === "saida" && quantidade > produto.estoque) {
      setMensagem("Estoque insuficiente! Só tem " + produto.estoque + " unidades.");
      return;
    }

    let estoqueFinal;
    if (tipo === "entrada") {
      estoqueFinal = produto.estoque + quantidade;
    } else {
      estoqueFinal = produto.estoque - quantidade;
    }

    // atualiza o estoque do produto
    setProdutos(
      produtos.map((p) => (p.codigoProduto === codigo ? { ...p, estoque: estoqueFinal } : p))
    );

    // guarda a movimentacao no historico
    const mov: Movimentacao = {
      id: proximoId,
      codigoProduto: codigo,
      descricao: descricao !== "" ? descricao : tipo === "entrada" ? "Entrada de mercadoria" : "Saída de mercadoria",
      tipo: tipo,
      quantidade: quantidade,
      estoqueFinal: estoqueFinal,
    };
    setMovimentacoes([mov, ...movimentacoes]);
    setProximoId(proximoId + 1);

    setMensagem(
      "Movimentação nº " + mov.id + " lançada! Estoque final de " + produto.descricaoProduto + ": " + estoqueFinal + " unidades."
    );
    setDescricao("");
    setQuantidade(1);
  }

  return (
    <div>
      <h2 className="border-b border-border pb-1 text-lg font-bold text-foreground">
        2) Movimentação de estoque
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Lance entradas e saídas dos produtos. Cada movimentação tem um número único e uma descrição.
      </p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-bold">Estoque atual:</h3>
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr className="border border-border bg-muted">
                <th className="border border-border px-2 py-1 text-left font-medium">Cód.</th>
                <th className="border border-border px-2 py-1 text-left font-medium">Produto</th>
                <th className="border border-border px-2 py-1 text-right font-medium">Estoque</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.codigoProduto}>
                  <td className="border border-border px-2 py-1">{p.codigoProduto}</td>
                  <td className="border border-border px-2 py-1">{p.descricaoProduto}</td>
                  <td className="border border-border px-2 py-1 text-right font-bold">{p.estoque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="text-sm font-bold">Nova movimentação:</h3>
          <div className="mt-2 space-y-2 text-sm">
            <div>
              <label className="mb-1 block">Produto:</label>
              <select
                value={codigo}
                onChange={(e) => setCodigo(Number(e.target.value))}
                className="w-full border border-input bg-background px-2 py-1"
              >
                {produtos.map((p) => (
                  <option key={p.codigoProduto} value={p.codigoProduto}>
                    {p.codigoProduto} - {p.descricaoProduto}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block">Tipo:</label>
              <label className="mr-4">
                <input
                  type="radio"
                  checked={tipo === "entrada"}
                  onChange={() => setTipo("entrada")}
                  className="mr-1"
                />
                Entrada
              </label>
              <label>
                <input
                  type="radio"
                  checked={tipo === "saida"}
                  onChange={() => setTipo("saida")}
                  className="mr-1"
                />
                Saída
              </label>
            </div>
            <div>
              <label className="mb-1 block">Quantidade:</label>
              <input
                type="number"
                min={1}
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className="w-full border border-input bg-background px-2 py-1"
              />
            </div>
            <div>
              <label className="mb-1 block">Descrição:</label>
              <input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="ex: compra do fornecedor"
                className="w-full border border-input bg-background px-2 py-1"
              />
            </div>
            <button
              onClick={lancar}
              className="border border-input bg-primary px-4 py-1 text-sm text-primary-foreground hover:bg-primary/90"
            >
              Lançar
            </button>
            {mensagem && <p className="text-sm text-foreground">{mensagem}</p>}
          </div>
        </div>
      </div>

      {movimentacoes.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-bold">Histórico de movimentações:</h3>
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr className="border border-border bg-muted">
                <th className="border border-border px-2 py-1 text-left font-medium">Nº</th>
                <th className="border border-border px-2 py-1 text-left font-medium">Descrição</th>
                <th className="border border-border px-2 py-1 text-left font-medium">Tipo</th>
                <th className="border border-border px-2 py-1 text-right font-medium">Qtd</th>
                <th className="border border-border px-2 py-1 text-right font-medium">Estoque final</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map((m) => (
                <tr key={m.id}>
                  <td className="border border-border px-2 py-1">{m.id}</td>
                  <td className="border border-border px-2 py-1">
                    {m.descricao} <span className="text-muted-foreground">(prod. {m.codigoProduto})</span>
                  </td>
                  <td className="border border-border px-2 py-1">
                    {m.tipo === "entrada" ? "Entrada" : "Saída"}
                  </td>
                  <td className="border border-border px-2 py-1 text-right">{m.quantidade}</td>
                  <td className="border border-border px-2 py-1 text-right font-bold">{m.estoqueFinal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ===================== EXERCICIO 3 - JUROS =====================

function Exercicio3() {
  const hoje = new Date().toISOString().slice(0, 10);
  const [valor, setValor] = useState(1000);
  const [vencimento, setVencimento] = useState(hoje);

  const resultado = calcularJuros(
    valor || 0,
    new Date(vencimento + "T00:00:00"),
    new Date(hoje + "T00:00:00")
  );

  return (
    <div>
      <h2 className="border-b border-border pb-1 text-lg font-bold text-foreground">
        3) Cálculo de juros
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Multa de 2,5% por dia de atraso, calculada até a data de hoje.
      </p>

      <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <label className="mb-1 block">Valor (R$):</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
            className="w-full border border-input bg-background px-2 py-1"
          />
        </div>
        <div>
          <label className="mb-1 block">Data de vencimento:</label>
          <input
            type="date"
            value={vencimento}
            onChange={(e) => setVencimento(e.target.value)}
            className="w-full border border-input bg-background px-2 py-1"
          />
        </div>
      </div>

      <div className="mt-4 text-sm">
        <p>
          Dias de atraso: <strong>{resultado.diasAtraso}</strong>
        </p>
        <p>
          Juros: <strong>{formatBRL(resultado.juros)}</strong>
        </p>
        <p>
          Valor total a pagar: <strong>{formatBRL(resultado.total)}</strong>
        </p>
      </div>
    </div>
  );
}
