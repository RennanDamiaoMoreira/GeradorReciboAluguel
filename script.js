const MESES = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro"
];

const CAMPOS = {
    inquilino: document.getElementById("inquilino"),
    locador: document.getElementById("locador"),
    rua: document.getElementById("rua"),
    numero: document.getElementById("numero"),
    complemento: document.getElementById("complemento"),
    bairro: document.getElementById("bairro"),
    cidade: document.getElementById("cidade"),
    inicio: document.getElementById("inicio"),
    final: document.getElementById("final"),
    valor: document.getElementById("valor"),
    valorExtenso: document.getElementById("valorExtenso"),
    segundaVia: document.getElementById("segunda-via")
};

const elementos = {
    form: document.getElementById("recibo-form"),
    recibo: document.getElementById("recibo"),
    vazio: document.getElementById("recibo-vazio"),
    erro: document.getElementById("form-error"),
    imprimir: document.getElementById("imprimir-btn"),
    limpar: document.getElementById("limpar-btn")
};

elementos.form.addEventListener("submit", gerarRecibos);
elementos.limpar.addEventListener("click", limparRecibos);
elementos.imprimir.addEventListener("click", imprimirRecibos);

function lerFormulario() {
    return {
        inquilino: CAMPOS.inquilino.value.trim(),
        locador: CAMPOS.locador.value.trim(),
        rua: CAMPOS.rua.value.trim(),
        numero: CAMPOS.numero.value.trim(),
        complemento: CAMPOS.complemento.value.trim(),
        bairro: CAMPOS.bairro.value.trim(),
        cidade: CAMPOS.cidade.value.trim(),
        inicio: CAMPOS.inicio.value,
        final: CAMPOS.final.value,
        valor: CAMPOS.valor.value.trim(),
        valorExtenso: CAMPOS.valorExtenso.value.trim(),
        segundaVia: CAMPOS.segundaVia.checked
    };
}

function validarFormulario(dados) {
    const erros = [];

    if (!dados.inquilino) erros.push("Informe o nome do inquilino.");
    if (!dados.locador) erros.push("Informe o nome do locador.");
    if (!dados.rua) erros.push("Informe a rua do imóvel.");
    if (!dados.numero) erros.push("Informe o número do imóvel.");
    if (!dados.bairro) erros.push("Informe o bairro do imóvel.");
    if (!dados.cidade) erros.push("Informe a cidade do imóvel.");
    if (!dados.inicio) erros.push("Informe a data inicial.");
    if (!dados.final) erros.push("Informe a data final.");

    const inicio = dados.inicio ? criarDataLocal(dados.inicio) : null;
    const fim = dados.final ? criarDataLocal(dados.final) : null;

    if (inicio && Number.isNaN(inicio.getTime())) {
        erros.push("A data inicial é inválida.");
    }

    if (fim && Number.isNaN(fim.getTime())) {
        erros.push("A data final é inválida.");
    }

    if (inicio && fim && fim < inicio) {
        erros.push("A data final precisa ser igual ou posterior à data inicial.");
    }

    let valorNormalizado = null;

    try {
        valorNormalizado = normalizarValor(dados.valor);
    } catch (error) {
        erros.push(error.message);
    }

    return {
        valido: erros.length === 0,
        erros,
        inicio,
        fim,
        valorNormalizado
    };
}

function normalizarValor(valorDigitado) {
    const entrada = valorDigitado.replace(/\s+/g, "");

    if (!entrada) {
        throw new Error("Informe o valor do aluguel.");
    }

    let numeroNormalizado = entrada;

    if (entrada.includes(",") && entrada.includes(".")) {
        if (entrada.lastIndexOf(",") > entrada.lastIndexOf(".")) {
            numeroNormalizado = entrada.replace(/\./g, "").replace(",", ".");
        } else {
            numeroNormalizado = entrada.replace(/,/g, "");
        }
    } else if (entrada.includes(",")) {
        numeroNormalizado = entrada.replace(",", ".");
    }

    const valor = Number.parseFloat(numeroNormalizado);

    if (!Number.isFinite(valor) || valor <= 0) {
        throw new Error("Informe um valor válido maior que zero.");
    }

    const centavos = Math.round(valor * 100);

    return {
        bruto: centavos / 100,
        centavos,
        formatado: formatarMoeda(centavos / 100)
    };
}

function calcularCompetencias(inicio, fim) {
    const competencias = [];
    const cursor = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
    const limite = new Date(fim.getFullYear(), fim.getMonth(), 1);

    while (cursor <= limite) {
        competencias.push(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
        cursor.setMonth(cursor.getMonth() + 1);
    }

    return competencias;
}

function gerarRecibos(event) {
    event.preventDefault();

    const dados = lerFormulario();
    const validacao = validarFormulario(dados);

    if (!validacao.valido) {
        mostrarErro(validacao.erros.join(" "));
        limparPrevia();
        return;
    }

    esconderErro();

    const valorExtenso = dados.valorExtenso || valorPorExtenso(validacao.valorNormalizado.centavos);
    const competencias = calcularCompetencias(validacao.inicio, validacao.fim);
    const recibos = [];

    competencias.forEach((competencia, indice) => {
        const baseRecibo = {
            numero: indice + 1,
            inquilino: dados.inquilino,
            locador: dados.locador,
            endereco: montarEndereco(dados),
            bairro: dados.bairro,
            cidade: dados.cidade,
            valorFormatado: validacao.valorNormalizado.formatado,
            valorExtenso,
            competencia,
            referencia: formatarReferencia(competencia),
            textoCompetencia: formatarCompetencia(competencia),
            dataPagamento: formatarDataPagamento(validacao.fim)
        };

        recibos.push(baseRecibo);

        if (dados.segundaVia) {
            recibos.push({
                ...baseRecibo,
                copia: "Segunda via"
            });
        }
    });

    renderizarRecibos(recibos);
}

function renderizarRecibos(recibos) {
    limparPrevia();

    const fragmento = document.createDocumentFragment();

    recibos.forEach((recibo, indice) => {
        fragmento.appendChild(criarTemplateRecibo(recibo));

        if (indice < recibos.length - 1) {
            fragmento.appendChild(criarGuiaEntreRecibos());
        }
    });

    elementos.recibo.appendChild(fragmento);
    elementos.vazio.style.display = "none";
}

function limparRecibos() {
    esconderErro();
    limparPrevia();
}

function limparPrevia() {
    elementos.recibo.replaceChildren();
    elementos.vazio.style.display = "block";
}

function imprimirRecibos() {
    if (!elementos.recibo.children.length) {
        mostrarErro("Gere ao menos um recibo antes de imprimir.");
        return;
    }

    esconderErro();
    window.print();
}

function criarTemplateRecibo(recibo) {
    const article = criarElemento("article", "receipt-item");

    if (recibo.copia) {
        article.appendChild(criarTextoBloco("div", "receipt-copy-badge", recibo.copia));
    }

    const guiaCorte = criarElemento("div", "cut-line");
    guiaCorte.appendChild(criarTextoBloco("span", "", "Corte aqui"));

    article.append(criarCanhoto(recibo), guiaCorte, criarReciboPrincipal(recibo));

    return article;
}

function criarGuiaEntreRecibos() {
    const guia = criarElemento("div", "page-cut-line");
    guia.appendChild(criarTextoBloco("span", "", "Guia de corte"));
    return guia;
}

function criarReciboPrincipal(recibo) {
    const principal = criarElemento("section", "receipt-main");
    const shell = criarElemento("div", "receipt-shell");

    const topo = criarElemento("div", "receipt-topline");
    const titulo = criarElemento("div", "receipt-title");
    titulo.append(
        criarTextoBloco("span", "", "Recibo de aluguel"),
        criarTextoBloco("span", "receipt-number-box", `Nº ${String(recibo.numero).padStart(2, "0")}`)
    );
    topo.appendChild(titulo);
    shell.appendChild(topo);

    const corpo = criarElemento("div", "receipt-body");
    corpo.append(
        criarLinhaTexto("Recebi(emos) de", recibo.inquilino),
        criarLinhaTexto("a importancia de", `${recibo.valorFormatado} (${recibo.valorExtenso})`, true),
        criarLinhaTexto("proveniente do aluguel do", recibo.endereco),
        criarGrupoTresColunas(
            criarLinhaTexto("sitio a", recibo.cidade),
            criarLinhaTexto("correspondente ao mes", recibo.textoCompetencia),
            criarLinhaTexto("nº", String(recibo.numero).padStart(2, "0"))
        ),
        criarChecks(recibo),
        criarDataRow(recibo.dataPagamento)
    );

    shell.appendChild(corpo);
    principal.appendChild(shell);

    return principal;
}

function criarCanhoto(recibo) {
    const canhoto = criarElemento("section", "stub");
    const shell = criarElemento("div", "stub-shell");
    shell.appendChild(criarTextoBloco("h4", "", "Canhoto destacável"));

    const topo = criarElemento("div", "stub-topline");
    topo.appendChild(criarTextoBloco("div", "stub-number", `Nº ${String(recibo.numero).padStart(2, "0")}`));
    shell.appendChild(topo);

    const resumo = criarElemento("div", "stub-lines");
    resumo.append(
        criarMiniLinha(`Aluguel ${recibo.valorFormatado}`),
        criarMiniLinha(`Referencia ${recibo.referencia}`),
        criarMiniLinha(`Locador ${recibo.locador}`),
        criarMiniLinha(`Liquido ${recibo.valorFormatado}`)
    );

    const detalhes = criarElemento("div", "stub-lines");
    detalhes.append(
        criarMiniLinha(`Recebi(emos) de ${recibo.inquilino}`),
        criarMiniLinha(`a quantia de ${recibo.valorFormatado}`),
        criarMiniLinha(`proveniente do aluguel de ${recibo.endereco}`),
        criarMiniLinha(`correspondente ao mes ${recibo.textoCompetencia}`)
    );

    const checks = criarElemento("div", "stub-checks");
    checks.appendChild(criarChecks(recibo));

    const assinatura = criarElemento("div", "stub-signature");
    assinatura.append(
        criarTextoBloco("strong", "", `Data Pagto. ${recibo.dataPagamento}`),
        criarElemento("div", "stub-signature-line")
    );

    shell.append(resumo, detalhes, checks, assinatura);
    canhoto.appendChild(shell);

    return canhoto;
}

function criarLinhaTexto(rotulo, valor, alto = false) {
    const linha = criarElemento("div", `line-box${alto ? " tall" : ""}`);
    linha.append(
        criarTextoBloco("strong", "", `${rotulo} `),
        criarTextoBloco("span", "", valor)
    );
    return linha;
}

function criarGrupoTresColunas(...itens) {
    const grupo = criarElemento("div", "three-col");
    grupo.append(...itens);
    return grupo;
}

function criarChecks(recibo) {
    const row = criarElemento("div", "check-row");
    row.append(
        criarCheckItem("Vencido"),
        criarCheckItem("a vencer-se em"),
        criarTextoBloco("span", "", recibo.textoCompetencia)
    );
    return row;
}

function criarCheckItem(texto) {
    const item = criarElemento("span", "check-item");
    item.append(criarElemento("span", "box"), criarTextoBloco("span", "", texto));
    return item;
}

function criarDataRow(dataPagamento) {
    const row = criarElemento("div", "date-row");
    row.append(
        criarTextoBloco("strong", "", "Data Pagto."),
        criarTextoBloco("span", "", dataPagamento),
        criarTextoBloco("span", "", "Assinatura do locador"),
        criarElemento("span", "mini-fill")
    );
    return row;
}

function criarMiniLinha(texto) {
    const linha = criarElemento("span", "mini-line");
    linha.textContent = texto;
    return linha;
}

function criarTextoBloco(tag, className, texto) {
    const elemento = criarElemento(tag, className);
    elemento.textContent = texto;
    return elemento;
}

function criarElemento(tag, className) {
    const elemento = document.createElement(tag);

    if (className) {
        elemento.className = className;
    }

    return elemento;
}

function montarEndereco(dados) {
    const partes = [
        `Rua ${dados.rua}`,
        `nº ${dados.numero}`
    ];

    if (dados.complemento) {
        partes.push(dados.complemento);
    }

    partes.push(dados.bairro, dados.cidade);

    return partes.filter(Boolean).join(", ");
}

function criarDataLocal(dataIso) {
    const [ano, mes, dia] = dataIso.split("-").map(Number);
    return new Date(ano, mes - 1, dia);
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(valor);
}

function formatarReferencia(data) {
    return `${String(data.getMonth() + 1).padStart(2, "0")}/${data.getFullYear()}`;
}

function formatarCompetencia(data) {
    return `${MESES[data.getMonth()]} de ${data.getFullYear()}`;
}

function formatarDataPagamento(data) {
    return new Intl.DateTimeFormat("pt-BR").format(data);
}

function mostrarErro(mensagem) {
    elementos.erro.textContent = mensagem;
    elementos.erro.classList.add("is-visible");
}

function esconderErro() {
    elementos.erro.textContent = "";
    elementos.erro.classList.remove("is-visible");
}

function valorPorExtenso(totalCentavos) {
    const inteiro = Math.floor(totalCentavos / 100);
    const centavos = totalCentavos % 100;
    const partes = [];

    if (inteiro > 0) {
        const inteiroExtenso = numeroPorExtenso(inteiro);
        partes.push(`${inteiroExtenso} ${inteiro === 1 ? "real" : "reais"}`);
    }

    if (centavos > 0) {
        const centavosExtenso = numeroPorExtenso(centavos);
        partes.push(`${centavosExtenso} ${centavos === 1 ? "centavo" : "centavos"}`);
    }

    if (!partes.length) {
        return "zero real";
    }

    return partes.join(" e ");
}

function numeroPorExtenso(numero) {
    if (numero === 0) {
        return "zero";
    }

    if (numero >= 1000000000) {
        return String(numero);
    }

    const escalas = [
        { valor: 1000000, singular: "milhão", plural: "milhões" },
        { valor: 1000, singular: "mil", plural: "mil" }
    ];

    let restante = numero;
    const partes = [];

    escalas.forEach((escala) => {
        if (restante >= escala.valor) {
            const quantidade = Math.floor(restante / escala.valor);
            restante %= escala.valor;

            if (escala.valor === 1000) {
                if (quantidade === 1) {
                    partes.push("mil");
                } else {
                    partes.push(`${centenaPorExtenso(quantidade)} mil`);
                }
            } else {
                partes.push(`${centenaPorExtenso(quantidade)} ${quantidade === 1 ? escala.singular : escala.plural}`);
            }
        }
    });

    if (restante > 0) {
        partes.push(centenaPorExtenso(restante));
    }

    if (partes.length === 1) {
        return partes[0];
    }

    const ultimaParte = partes.pop();
    return `${partes.join(", ")} e ${ultimaParte}`;
}

function centenaPorExtenso(numero) {
    const unidades = [
        "",
        "um",
        "dois",
        "três",
        "quatro",
        "cinco",
        "seis",
        "sete",
        "oito",
        "nove"
    ];

    const especiais = [
        "dez",
        "onze",
        "doze",
        "treze",
        "quatorze",
        "quinze",
        "dezesseis",
        "dezessete",
        "dezoito",
        "dezenove"
    ];

    const dezenas = [
        "",
        "",
        "vinte",
        "trinta",
        "quarenta",
        "cinquenta",
        "sessenta",
        "setenta",
        "oitenta",
        "noventa"
    ];

    const centenas = [
        "",
        "cento",
        "duzentos",
        "trezentos",
        "quatrocentos",
        "quinhentos",
        "seiscentos",
        "setecentos",
        "oitocentos",
        "novecentos"
    ];

    if (numero === 100) {
        return "cem";
    }

    const partes = [];
    const centena = Math.floor(numero / 100);
    const resto = numero % 100;

    if (centena > 0) {
        partes.push(centenas[centena]);
    }

    if (resto >= 10 && resto < 20) {
        partes.push(especiais[resto - 10]);
    } else {
        const dezena = Math.floor(resto / 10);
        const unidade = resto % 10;

        if (dezena > 0) {
            partes.push(dezenas[dezena]);
        }

        if (unidade > 0) {
            partes.push(unidades[unidade]);
        }
    }

    return partes.filter(Boolean).join(" e ");
}
