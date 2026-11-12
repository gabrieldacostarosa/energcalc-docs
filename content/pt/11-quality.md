---
slug: quality
title: Qualidade e testes
group: Tecnologia
description: Como os cálculos e as regras são verificados antes de cada versão.
---

# Qualidade e testes

O EnergCalc trata cada fórmula como uma promessa: ela precisa ter um caso de teste com o resultado esperado calculado à mão.

## Testes automáticos (68)

| Grupo | O que verifica |
|---|---|
| **Consumo** | Uma carga, várias cargas, ciclo de trabalho, consumo medido, standby, apagões curtos e longos, prioridades. |
| **Bateria e corrente** | Perdas sem contagem dupla, profundidade de descarga, temperatura, Ah, tensão do banco, limites do BMS, dados ausentes. |
| **Inversor** | Potência contínua, aparente e de pico; cargas que não ligam juntas; forma de onda; tensão e frequência. |
| **Solar e controlador** | Potência dos painéis, pior mês, tempo de recarga, tensão no frio, tensão no calor, corrente, compatibilidade do controlador. |
| **Estações** | Energia utilizável estimada, pico não documentado, baterias extras, escolha da recomendação. |
| **Oferta** | Cada faixa de preço, o preço cheio e a última chance usada uma única vez. |
| **Relatório** | As 24 seções, lista de materiais igual à configuração, tradução de todas as mensagens. |
| **Marco de engenharia** | Geladeira + internet + luz em 8 h, 24 h e com painéis solares; resultado determinístico. |

## Outras verificações

- **Tipos estritos (TypeScript)** em todo o site, no motor e nas funções do servidor.
- **Regras de acesso testadas num banco PostgreSQL real**, simulando visitante, comprador, administrador e intruso.
- **Testes de navegador** percorrendo a calculadora, o resultado, a oferta, o portal e o painel, no computador e no celular.
- **Rastreio validado de ponta a ponta:** eventos gerados no navegador foram capturados e gravados no banco com as regras de acesso ativas.
- **Relatório em PDF gerado e conferido** página por página.

## Regras de qualidade

- Valores intermediários nunca são arredondados; só o que aparece na tela.
- Entrada inválida (horas acima de 24, potência negativa, número não numérico) é recusada, nunca "corrigida" em silêncio.
- Uma versão só é considerada pronta quando todos os testes passam.
