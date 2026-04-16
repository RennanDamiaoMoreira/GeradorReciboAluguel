# Gerador de Recibos de Aluguel

Aplicação estática em HTML, CSS e JavaScript para gerar recibos mensais de aluguel com pré-visualização e impressão em A4.

## Acesso

[Abrir o sistema](https://rennandamiaomoreira.github.io/GeradorReciboAluguel/)

## O que mudou

- Geração por competências mensais inclusivas
- Validação de formulário antes da prévia
- Normalização de moeda brasileira
- Valor por extenso calculado automaticamente
- Layout de impressão com canhoto destacável
- Opção de segunda via por recibo

## Como usar

1. Preencha os dados do inquilino, locador e imóvel.
2. Informe a data inicial e a data final do período.
3. Digite o valor do aluguel.
4. Opcionalmente, informe o valor por extenso manualmente.
5. Clique em `Gerar recibos`.
6. Revise a pré-visualização e clique em `Imprimir`.

## Regras do período

O sistema considera competências mensais inclusivas.

Exemplo:

- Data inicial: janeiro de 2026
- Data final: março de 2026
- Resultado: recibos de janeiro, fevereiro e março

## Impressão

- Formato pensado para A4 retrato
- O formulário é ocultado automaticamente na impressão
- Cada recibo é impresso junto com seu canhoto
- A segunda via duplica o recibo completo, incluindo o canhoto

## Estrutura

- [`index.html`](/Users/rennan_mac/Documents/Personal/GeradorReciboAluguel/index.html): layout, formulário, preview e estilos
- [`script.js`](/Users/rennan_mac/Documents/Personal/GeradorReciboAluguel/script.js): validação, cálculo de competências, formatação e renderização
