var mes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function removeElemento() {
    document.getElementById("recibo").innerHTML = '';
    document.getElementById("modelo").style.display = "";
}

function adcElemento() {
    document.getElementById("modelo").style.display = "none";
    inquilino = document.getElementById("inquilino").value;
    locador = document.getElementById("locador").value;
    valor = (document.getElementById("valor").value);
    valorExtenso = document.getElementById("valorExtenso").value ? document.getElementById("valorExtenso").value : extenso(valor);
    inicio = document.getElementById("inicio").value;
    final = document.getElementById("final").value;
    cidade = document.getElementById("cidade").value;
    bairro = document.getElementById("bairro").value;
    casa = document.getElementById("numero").value;
    ap = document.getElementById("casa").value;
    rua = document.getElementById("rua").value;
    segundaVia = document.getElementById("segunda-via").checked;
    
    inicio = inicio.split("-");
    inicio = new Date(inicio[0], (inicio[1] - 1), inicio[2]);
    final = final.split("-");
    final = new Date(final[0], (final[1] - 1), final[2]);
    numeroMeses = calculaMeses(inicio, final);
    dataAtual = inicio;


    console.log(inicio, final, numeroMeses, dataAtual, inquilino, locador, valor, valorExtenso, cidade, bairro, casa, ap, rua, segundaVia)
    
    for (let numero = 1; numero <= numeroMeses; numero++) {
        let conteudoA, conteudoB;

        conteudoA = retornaString(inquilino, locador, mes[dataAtual.getMonth()], numero, valor, valorExtenso, (`${dataAtual.getMonth()+1}/${dataAtual.getYear()+1900}`), rua, bairro, casa, ap, cidade,dataAtual);
        
        if (segundaVia) {
            conteudoB = conteudoA;
        } else {
            numero++;
            dataAtual.setMonth(dataAtual.getMonth() + 1);

            if (numero > numeroMeses) {
                break;
            }

            conteudoB = retornaString(inquilino, locador, mes[dataAtual.getMonth()], numero, valor, valorExtenso, (`${dataAtual.getMonth()+1}/${dataAtual.getYear()+1900}`), rua, bairro, casa, ap, cidade,dataAtual);
        }

        document.getElementById("recibo").innerHTML += conteudoA + conteudoB + "<div class='quebraPag'></div>";
    
        dataAtual.setMonth(dataAtual.getMonth() + 1);
    }
}

function retornaString(inquilino, locador, nomeMes, numero, valor, valorExtenso, referencia, rua, bairro, numeroCasa, numeroAP, cidade, dataAtual) {
    return `<div class="row">
                <div class="col s12">
                    <div class="container">
                        <div class="card">
                            <div class="row">
                                <div class="col s2 center-align offset-s1">
                                    <h6>Mês de Referência</h6>
                                    <h6 class="dataRef">${referencia}</h6>
                                </div>
                                <div class="col s6 center-align">
                                    <h6>RECIBO DE ALUGUEL</h6>
                                </div>
                                <div class="col s2">
                                    <h6>Nº${numero}</h6>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col s6 center">
                                    <h6>INQUILINO(A)</h6>
                                    <p class="col s10 offset-s1">${inquilino}</p>
                                </div>
                                <div class="col s6 center">
                                    <h6>PROPRIETÁRIO(A)</h6>
                                    <p class="col s10 offset-s1">${locador}</p>
                                </div>
                                <div class="col s12 container center">
                                    <h6>ENDEREÇO</h6>
                                    <p>RUA ${rua}, Nº ${numeroCasa}, CASA ${numeroAP}, ${bairro} ${cidade}</p>
                                    <p>Recebi de ${inquilino}, a importância de R$ ${valor} (${valorExtenso}), como
                                        pagamento do aluguel do imóvel residencial indicado acima, referente ao mês de
                                        ${nomeMes} de ${dataAtual.getYear() + 1900}.</p>
                                </div>
                            </div>
                            <div style="padding-bottom: 10px;">
                                <div class="row">
                                    <div class="col s9 center ">
                                        <hr>
                                        <h6>${locador}</h6>
                                    </div>
                                    <div class="col s3">
                                        <hr>
                                        <h6>Data de Pagamento</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}


function calculaMeses(inicio, fim) {
    if ((inicio.getYear() - fim.getYear()) == 0) {
        return (fim.getMonth() - inicio.getMonth())
    } else {
        prazo = 12 - inicio.getMonth();
        fatorMultiplicador = (fim.getYear() - inicio.getYear()) - 1;
        prazo = prazo + (12 * fatorMultiplicador);
        acrescimo = fim.getMonth();
        return acrescimo + prazo;
    }
}

function extenso(params) {

    value = (parseInt(params));
    centavos = params.split('.').length == 2 ? params.split('.')[1] : params.split(',').length == 2 ? params.split(',')[1] : null

    tamanhoReal = value.toString().length;
    tamanhoCentavo = centavos ? centavos.toString().length : 0;
    value = parseVector(value, tamanhoReal);
    centavos = parseVector(centavos, tamanhoCentavo);

    value = (generateString(value, tamanhoReal));
    centavos = (generateString(centavos, tamanhoCentavo))

    final = value + (value !== "UM" ? " REAIS" : " REAL") + (centavos ? " E" + (centavos !== " UM" ? centavos + " CENTAVOS" : centavos + " CENTAVO") : "");


    return final;
}
function cadeiaDez(value) {
    switch (value) {
        case 1:
            return "ONZE";
        case 2:
            return "DOZE"
        case 3:
            return "TREZE"
        case 4:
            return "QUARTOZE";
        case 5:
            return "QUINZE"
        case 6:
            return "DEZESSEIS"
        case 7:
            return "DEZESSETE";
        case 8:
            return "DEZOITO"
        case 9:
            return "DEZENOVE"
    }
}
function parseVector(elem, size) {
    if (size == 1 && elem == 0) return []
    let vector = [];
    for (let i = 0; i < size; i++) {
        vector.push(parseInt(elem / (Math.pow(10, i))));
    }

    for (let i = 0; i < size; i++) {
        if (i == size - 1) { }
        else {
            vector[i] = (vector[i] - (vector[i + 1] * 10));

        }

    }
    return vector;
}
function generateString(vetor, size) {
    let final = "";
    for (size = size - 1; 0 <= size; size--) {

        switch (size) {
            case 4: //dezena de milhar
            switch (vetor[size]) {
                case 1:
                    if (vetor.every(elem => elem == 0)) {
                        final = (final.length > 0 ? final + " E" : "") + " DEZ";
                    } else {
                        final = (final.length > 0 ? final + " E " : "") + cadeiaDez(vetor[size - 1]) + " MIL";
                        size -= 1;
                    }
                    break;
                case 2:
                    final = (final.length > 0 ? final + " E" : "") + " VINTE ";
                    break;
                case 3:
                    final = (final.length > 0 ? final + " E" : "") + " TRINTA ";
                    break;
                case 4:
                    final = (final.length > 0 ? final + " E" : "") + " QUARENTA ";
                    break;
                case 5:
                    final = (final.length > 0 ? final + " E" : "") + " CINQUENTA ";
                    break;
                case 6:
                    final = (final.length > 0 ? final + " E" : "") + " SESSENTA ";
                    break;
                case 7:
                    final = (final.length > 0 ? final + " E" : "") + " SETENTA ";
                    break;
                case 8:
                    final = (final.length > 0 ? final + " E" : "") + " OITENTA ";
                    break;
                case 9:
                    final = (final.length > 0 ? final + " E" : "") + " NOVENTA ";
                    break;
                default:
                    ;
                    break;
            }
            break;
            case 3: // milhar

                switch (vetor[size]) {
                    case 0 :
                        final = (final.length > 0 ? final + " E" : "") + " MIL";
                        break;
                    case 1:
                        if (vetor.every(elem => elem == 0)) {
                            final = (final.length > 0 ? final + " E" : "") + " MIL";
                        } else {
                            final = (final.length > 0 ? final + " E" : "") + " UM MIL";
                        }
                        break;
                    case 2:
                        final = (final.length > 0 ? final + " E" : "") + " DOIS MIL";
                        break;
                    case 3:
                        final = (final.length > 0 ? final + " E" : "") + " TRÊS MIL";
                        break;
                    case 4:
                        final = (final.length > 0 ? final + " E" : "") + " QUATRO MIL";
                        break;
                    case 5:
                        final = (final.length > 0 ? final + " E" : "") + " CINCO MIL";
                        break;
                    case 6:
                        final = (final.length > 0 ? final + " E" : "") + " SEIS MIL";
                        break;
                    case 7:
                        final = (final.length > 0 ? final + " E" : "") + " SETE MIL";
                        break;
                    case 8:
                        final = (final.length > 0 ? final + " E" : "") + " OITO MIL";
                        break;
                    case 9:
                        final = (final.length > 0 ? final + " E" : "") + " NOVE MIL";
                        break;
                    default:
                        ;
                        break;
                }
                break;
            case 2: // centena

                switch (vetor[size]) {
                    case 1:
                        if (vetor.every(elem => elem == 0)) {
                            final = (final.length > 0 ? final + " E" : "") + " CEM";
                        } else {
                            final = (final.length > 0 ? final + " E" : "") + " CENTO";
                        }
                        break;
                    case 2:
                        final = (final.length > 0 ? final + " E" : "") + " DUZENTOS";
                        break;
                    case 3:
                        final = (final.length > 0 ? final + " E" : "") + " TREZENTOS";
                        break;
                    case 4:
                        final = (final.length > 0 ? final + " E" : "") + " QUATROCENTOS";
                        break;
                    case 5:
                        final = (final.length > 0 ? final + " E" : "") + " QUINHENTOS";
                        break;
                    case 6:
                        final = (final.length > 0 ? final + " E" : "") + " SEISCENTOS";
                        break;
                    case 7:
                        final = (final.length > 0 ? final + " E" : "") + " SETECENTOS";
                        break;
                    case 8:
                        final = (final.length > 0 ? final + " E" : "") + " OITOCENTOS";
                        break;
                    case 9:
                        final = (final.length > 0 ? final + " E" : "") + " NOVECENTOS";
                        break;
                    default:
                        ;
                        break;
                }
                break;
            case 1: // dezena

                switch (vetor[size]) {
                    case 1:
                        if (vetor.every(elem => elem == 0)) {
                            final = (final.length > 0 ? final + " E" : "") + " DEZ";
                        } else {
                            final = (final.length > 0 ? final + " E " : "") + cadeiaDez(vetor[size - 1]);
                            size -= 1;
                        }
                        break;
                    case 2:
                        final = (final.length > 0 ? final + " E" : "") + " VINTE";
                        break;
                    case 3:
                        final = (final.length > 0 ? final + " E" : "") + " TRINTA";
                        break;
                    case 4:
                        final = (final.length > 0 ? final + " E" : "") + " QUARENTA";
                        break;
                    case 5:
                        final = (final.length > 0 ? final + " E" : "") + " CINQUENTA";
                        break;
                    case 6:
                        final = (final.length > 0 ? final + " E" : "") + " SESSENTA";
                        break;
                    case 7:
                        final = (final.length > 0 ? final + " E" : "") + " SETENTA";
                        break;
                    case 8:
                        final = (final.length > 0 ? final + " E" : "") + " OITENTA";
                        break;
                    case 9:
                        final = (final.length > 0 ? final + " E" : "") + " NOVENTA";
                        break;
                    default:
                        ;
                        break;
                }
                break;
            case 0: // unidade

                switch (vetor[size]) {
                    case 1:
                        final = (final.length > 0 ? final + " E" : "") + " UM";
                        break;
                    case 2:
                        final = (final.length > 0 ? final + " E" : "") + " DOIS";
                        break;
                    case 3:
                        final = (final.length > 0 ? final + " E" : "") + " TRÊS";
                        break;
                    case 4:
                        final = (final.length > 0 ? final + " E" : "") + " QUATRO";
                        break;
                    case 5:
                        final = (final.length > 0 ? final + " E" : "") + " CINCO";
                        break;
                    case 6:
                        final = (final.length > 0 ? final + " E" : "") + " SEIS";
                        break;
                    case 7:
                        final = (final.length > 0 ? final + " E" : "") + " SETE";
                        break;
                    case 8:
                        final = (final.length > 0 ? final + " E" : "") + " OITO";
                        break;
                    case 9:
                        final = (final.length > 0 ? final + " E" : "") + " NOVE";
                        break;
                    default:
                        ;
                        break;
                }
                break;
            default:

                break;
        }
    }
    return final
}