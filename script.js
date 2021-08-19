var mes = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];


function adcElemento () {
   inquilino = document.getElementById("inquilino").value;
   locador = document.getElementById("locador").value;
   valorExtenso = document.getElementById("valorExtenso").value;
   valor=document.getElementById("valor").value;
   inicio = document.getElementById("inicio").value;
   final = document.getElementById("final").value;
   cidade = document.getElementById("cidade").value;
   bairro=document.getElementById("bairro").value;
   casa = document.getElementById("numero").value;
   ap = document.getElementById("casa").value;
   rua = document.getElementById("rua").value;
inicio = inicio.split("-");
inicio=new Date(inicio[0],(inicio[1]-1),inicio[2]);
final = final.split("-");
final=new Date(final[0],(final[1]-1),final[2]);

numeroMeses=calculaMeses(inicio,final);
dataAtual=inicio;
console.log(dataAtual.getYear());
  
   
   for (let numero = 1 ;numero<= numeroMeses;numero++){

    final = '<div class="quebraPag">'+retornaString(inquilino,locador,mes[dataAtual.getMonth()],numero,valor,(dataAtual.getMonth()+1)+"/"+(dataAtual.getYear()+1900) , rua,bairro,casa,ap,cidade)+retornaString(inquilino,locador,mes[dataAtual.getMonth()],numero,valor,(dataAtual.getMonth()+1)+"/"+(dataAtual.getYear()+1900) , rua,bairro,casa,ap,cidade)+"</div>";
    console.log(dataAtual.getMonth());
    document.getElementById("recibo").innerHTML+=final;   
  
dataAtual.setMonth(dataAtual.getMonth()+1);
  
}
  }

function retornaString(inquilino,locador,nomeMes,numero,valor,referencia,rua,bairro,numeroCasa,numeroAP,cidade){
  base ='<DIV class="ROW">'+
            '<div class="col s12">'+
                '<div class=" container  ">'+
                    '<div class="card ">'+
                       ' <div class="row">'+
                           ' <div class=" col s2 center-align offset-s1">'+
                               ' <h6>Mês de Referência</h6>'+
                                '<h6 class="dataRef">'+referencia+'</h6>'+
                            '</div>'+
                            '<div class=" col s6 center-align">'+
                                '<h6>RECIBO DE ALUGUEL</h6>'+
                            '</div>'+
                            '<div class=" col s2">'+
                                '<h6>Nº'+numero+'</h6>'+
                            '</div>'+
                        '</div>'+
                        '<div class="row">'+
                            '<div class="col s6 center">'+
                                '<h6>INQUILINO(A)</h6>'+
                                '<p class="col s10 offset-s1">'+inquilino+'</p>'+
                            '</div>'+
                            '<div class="col s6 center">'+
                                '<h6>PROPRIETARIO(A)</h6>'+
                                '<p class="col s10 offset-s1">'+locador+'</p>'+
                            '</div>'+
                            '<div class="col s12 container center">'+
                                '<h6>ENDEREÇO</h6>'+
                                '<P>RUA '+rua+', Nº '+numeroCasa+', CASA '+numeroAP+', '+bairro+' '+cidade+'</P>'+
                                '<p>Recebi de, '+inquilino+', a importância de R$ '+valor+'('+valorExtenso+' REAIS), como pagamento do aluguel do imóvel residencial indicado acima, referente ao mês de '+nomeMes+' de '+(dataAtual.getYear()+1900)+'.</p>'+

                            '</div>'+
                        '</div>'+



                        '<div class="row ">'+
                        
                            '<div class="col s10 center offset-s1" >'+
                                '<HR>'+
                                '</HR>'+
                                '<h6 >'+locador+
                                '</h6>'+
                            '</div>'+
                        '</div>'+


                    '</div>'+
                '</div>'+
            '</div>'+
        '</DIV></div>';
    
    return base;
    }


    function calculaMeses(inicio,fim){
        if ((inicio.getYear()- fim.getYear())==0){
            return (fim.getMonth()-inicio.getMonth())
        }else{
            prazo = 12 - inicio.getMonth();
            fatorMultiplicador = ( fim.getYear()-inicio.getYear())-1;
            prazo=prazo+(12*fatorMultiplicador);
            acrescimo = fim.getMonth();
            return acrescimo+prazo;
        }
    }