// 1. Interface e implementação de banco de dados
interface BancoDeDados {
    salvar(dados: any): void;
}

class BancoDeDadosMySQL implements BancoDeDados {
    salvar(dados: any): void {
        console.log("Salvando dados no MySQL...");
    }
}

class BancoDeDadosEmMemoria implements BancoDeDados {
    public dados: any[] = [];

    salvar(dados: any): void {
        this.dados.push(dados);
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

    calcularFrete(pedido: PedidoComFrete): number {
        return pedido.calcularFrete();
    }
}

class PedidoRepository {
    constructor(private bancoDeDados: BancoDeDados) {}

    salvar(pedido: Pedido): void {
        this.bancoDeDados.salvar(pedido);
    }
}

class EmailService {
    enviarConfirmacao(): void {
        console.log("Enviando e-mail de confirmação para o cliente...");
    }
}

// 3. Interfaces de capacidades do pedido
interface PedidoProcessavel {
    processarPagamento(): void;
}

interface PedidoComNotaFiscal {
    gerarNotaFiscal(): void;
}

interface PedidoComEtiquetaFisica {
    imprimirEtiquetaFisica(): void;
}

interface PedidoComFrete {
    calcularFrete(): number;
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

// 5. Implementação para produtos físicos
class PedidoProdutoFisico extends Pedido implements PedidoComFrete, PedidoProcessavel, PedidoComNotaFiscal, PedidoComEtiquetaFisica {
    calcularFrete(): number {
        return 15.0;
    }

    processarPagamento(): void {
        console.log("Pagamento processado.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal gerada.");
    }

    imprimirEtiquetaFisica(): void {
        console.log("Etiqueta física impressa.");
    }
}

// 6. Implementação para produtos digitais
class PedidoProdutoDigital extends Pedido implements PedidoProcessavel, PedidoComNotaFiscal {
    processarPagamento(): void {
        console.log("Pagamento processado online.");
    }

    gerarNotaFiscal(): void {
        console.log("Nota fiscal digital gerada.");
    }
}
