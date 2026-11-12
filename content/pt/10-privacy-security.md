---
slug: privacy-security
title: Privacidade e segurança
group: Tecnologia
description: Que dados existem, para que servem e como são protegidos.
---

# Privacidade e segurança

## Que dados o EnergCalc usa

| Dado | Quando | Para quê |
|---|---|---|
| **Navegação anônima** (páginas, cliques, origem da visita, tipo de aparelho) | Durante o uso | Medir e melhorar o site. Ligada a um identificador aleatório, sem nome nem e-mail. |
| **Projeto de energia** (aparelhos, horas, região) | Ao calcular | Gerar o resultado e o relatório. |
| **Cadastro** (nome, e-mail, WhatsApp opcional) | Na compra | Entregar o relatório e dar suporte. |
| **Pagamento** | No Mercado Pago | Processado pelo Mercado Pago. O EnergCalc não vê dados de cartão. |
| **Controle da oferta** (identificador do aparelho, rede e e-mail) | Ao calcular e comprar | Aplicar a oferta por pessoa. Guardado de forma **irreversível (hash)** e apagado em até 90 dias. |

O EnergCalc **não** coleta localização precisa, **não** vende dados e **respeita** o sinal "Do Not Track" do navegador para as métricas.

## Direitos (LGPD)

A pessoa pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo contato do site.

## Como os dados são protegidos

| Proteção | Em termos simples |
|---|---|
| **Regras de acesso no banco** | Cada pessoa só enxerga o que é dela. Mesmo um pedido bem formado para dados de outra pessoa volta vazio. |
| **Decisões no servidor** | Preço, cálculo oficial e liberação do relatório nunca dependem do navegador. |
| **Pagamento confirmado na fonte** | A liberação depende de uma confirmação consultada diretamente no Mercado Pago, com verificação de assinatura e conferência de valor. |
| **Registros imutáveis** | Cálculos e versões de relatório não podem ser alterados depois de gravados. |
| **PDFs privados** | Entregues por links temporários, só para o comprador. |
| **E-mail confirmado** | O portal só abre depois que a pessoa confirma ser dona do e-mail. |
| **Administração protegida** | A permissão de administrador fica no banco e não pode ser concedida pelo próprio usuário. |
| **Trilha de auditoria** | Alterações administrativas (preços, liberações, estornos) ficam registradas com autor e data. |
| **Segredos fora do site** | Chaves de serviço ficam apenas no servidor, nunca no código do navegador. |

> Esta página descreve os princípios de segurança. Detalhes de implementação que poderiam ajudar alguém a contornar as proteções não são publicados.
