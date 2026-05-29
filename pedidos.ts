// 1. Classe de Banco de Dados Concreta
class BancoDeDadosMySQL {
    salvar(dados: any): void {
        console.log("Salvando dados no MySQL...");
    }
}

// 2. Servicos com responsabilidades especificas
interface RegraDesconto {
    calcular(valorTotal: number): number;
}

class SemDesconto implements RegraDesconto {
    calcular(): number {
        return 0;
    }
}

class DescontoVip implements RegraDesconto {
    calcular(valorTotal: number): number {
        return valorTotal * 0.20;
    }
}

class DescontoEstudante implements RegraDesconto {
    calcular(valorTotal: number): number {
        return valorTotal * 0.10;
    }
}

class DescontoPremium implements RegraDesconto {
    calcular(valorTotal: number): number {
        return valorTotal * 0.15;
    }
}

class CalculadoraPedido {
    calcularDesconto(pedido: Pedido): number {
        return pedido.regraDesconto.calcular(pedido.valorTotal);
    }

    calcularFrete(): number {
        return 15.0;
    }
}

class PedidoRepository {
    constructor(private bancoDeDados: BancoDeDadosMySQL) {}

    salvar(pedido: Pedido): void {
        this.bancoDeDados.salvar(pedido);
    }
}

class EmailService {
    enviarConfirmacao(): void {
        console.log("Enviando e-mail de confirmação para o cliente...");
    }
}

// 3. Interface de tarefas do pedido
interface ITarefasPedido {
    processarPagamento(): void;
    gerarNotaFiscal(): void;
    imprimirEtiquetaFisica(): void;
}

// 4. Classe principal de Pedido
class Pedido {
    public valorTotal: number;
    public regraDesconto: RegraDesconto;

    constructor(valorTotal: number, regraDesconto: RegraDesconto = new SemDesconto()) {
        this.valorTotal = valorTotal;
        this.regraDesconto = regraDesconto;
    }
}

// 5. Implementação para produtos digitais
class PedidoProdutoDigital extends Pedido implements ITarefasPedido {
    processarPagamento(): void {
        console.log("Pagamento processado online.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal digital gerada.");
    }

    imprimirEtiquetaFisica(): void {
        throw new Error("Erro: Não é possível imprimir etiqueta para produto digital.");
    }
}
