---
slug: worked-example
title: Exemplo resolvido
group: Como funciona
description: Geladeira, internet e iluminação — o cálculo passo a passo.
---

# Exemplo resolvido: geladeira, internet e luz

Este é o caso de referência usado nos testes automáticos do EnergCalc. Os números abaixo são exatamente os que o motor produz.

## Entradas

| Aparelho | Potência | Qtd | Horas/dia | Ciclo | Pico de partida |
|---|---|---|---|---|---|
| Geladeira frost-free | 150 W | 1 | 24 h | 40% | 5× |
| Roteador + ONU | 15 W | 1 | 24 h | 100% | — |
| Lâmpada LED | 9 W | 4 | 6 h | 100% | — |

Local: Sudeste, tomada de 127 V, 60 Hz. Bateria preferida: LiFePO4.

## Passo 1 — Energia por dia

| Aparelho | Conta | Resultado |
|---|---|---|
| Geladeira | 150 W × 1 × 24 h × 0,40 | **1.440 Wh** |
| Roteador | 15 W × 1 × 24 h × 1,00 | **360 Wh** |
| Lâmpadas | 9 W × 4 × 6 h × 1,00 | **216 Wh** |
| **Total** | | **2.016 Wh ≈ 2,02 kWh por dia** |

Para um apagão de **8 horas**, a conta muda: a geladeira e o roteador funcionam 8 h (480 + 120 Wh) e as lâmpadas, suas 6 h (216 Wh) — total **816 Wh**.

## Passo 2 — Bateria (apagão de 24 h)

1. Perda do inversor: 2.016 ÷ 0,90 = **2.240 Wh** saindo da bateria.
2. Profundidade de descarga (LiFePO4): 2.240 ÷ 0,90 = 2.489 Wh.
3. Reserva de envelhecimento: 2.489 × 1,10 = **2.738 Wh nominais** (≈ 2,74 kWh).

Como passa de 2,5 kWh, o banco sobe para **24 V**: 2.738 ÷ 24 ≈ **114 Ah**.

## Passo 3 — Inversor

- Potência simultânea: 150 + 15 + 36 = **201 W**.
- Potência aparente, com fator 0,8 no motor da geladeira: 150 ÷ 0,8 + 15 + 36 = **238,5 VA**.
- Com margem de 25%: 238,5 × 1,25 ≈ **298 W** contínuos.
- Pico: 201 W + a partida da geladeira (150 W × 4 extra) = **801 W**.

Qualquer inversor **senoidal pura** com pelo menos ~300 W contínuos e ~800 W de pico atende. Na prática, os modelos de 1.000 W ou mais cobrem com folga.

## Passo 4 — Painéis solares (Sudeste)

2.240 Wh ÷ (5,0 h × 0,75 × 0,95) ≈ **629 Wp**.

O motor procura então um arranjo real e valida o controlador. Por exemplo: dois módulos de 550 W em série estourariam um controlador de 100 V num dia frio (≈ 106,5 V), então essa combinação é descartada e outra é escolhida.

## Passo 5 — Estação pronta

Uma estação de 1.152 Wh nominais entrega cerca de 1.152 × 0,85 ≈ **979 Wh** utilizáveis (estimativa):

- **8 horas (816 Wh):** atende — com potência e pico de sobra.
- **24 horas (2.016 Wh):** não atende sozinha. Nesse caso, o resultado mostra a estação mais próxima (com quantas horas ela sustenta) e recomenda um **sistema montado**.

## O que este exemplo ensina

- A **geladeira** domina o consumo (71%). Reduzir seu uso é o jeito mais barato de diminuir o sistema.
- A **bateria** é cerca de **36% maior** que o consumo, por causa de perdas, descarga segura e envelhecimento.
- **Potência** e **energia** levam a decisões diferentes: o inversor pode ser pequeno, a bateria não.
