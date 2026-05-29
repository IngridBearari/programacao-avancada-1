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

/*
Justificativa das mudanças:
1. SRP: Pedido ficou responsavel apenas pelos dados principais; calculos,
   persistencia e envio de e-mail foram separados em servicos especificos.
2. OCP: Os descontos foram modelados pela interface RegraDesconto, permitindo
   criar novos descontos sem alterar a CalculadoraPedido.
3. LSP: PedidoProdutoDigital nao herda nem implementa comportamento de frete,
   evitando excecoes em metodos que nao fazem sentido para produtos digitais.
4. ISP: A interface grande de tarefas foi dividida em interfaces menores, para
   que cada tipo de pedido implemente apenas as capacidades que realmente possui.
5. DIP: PedidoRepository depende da abstracao BancoDeDados, recebida por injecao,
   permitindo trocar MySQL por outra implementacao, como BancoDeDadosEmMemoria.
*/

const calculadora = new CalculadoraPedido();
const bancoDeDados = new BancoDeDadosEmMemoria();
const pedidoRepository = new PedidoRepository(bancoDeDados);
const emailService = new EmailService();

const pedidoFisico = new PedidoProdutoFisico(100, new DescontoVip());
const pedidoDigital = new PedidoProdutoDigital(80, new DescontoPremium());

console.log("Desconto pedido fisico:", calculadora.calcularDesconto(pedidoFisico));
console.log("Frete pedido fisico:", calculadora.calcularFrete(pedidoFisico));
pedidoFisico.processarPagamento();
pedidoFisico.gerarNotaFiscal();
pedidoFisico.imprimirEtiquetaFisica();

console.log("Desconto pedido digital:", calculadora.calcularDesconto(pedidoDigital));
pedidoDigital.processarPagamento();
pedidoDigital.gerarNotaFiscal();

pedidoRepository.salvar(pedidoFisico);
pedidoRepository.salvar(pedidoDigital);
emailService.enviarConfirmacao();

console.log("Pedidos salvos em memoria:", bancoDeDados.dados.length);
