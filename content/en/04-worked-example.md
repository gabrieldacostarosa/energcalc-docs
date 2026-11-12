---
slug: worked-example
title: Worked example
group: How it works
description: Fridge, internet and lights — the calculation step by step.
---

# Worked example: fridge, internet and lights

This is the reference case used in EnergCalc's automated tests. The numbers below are exactly what the engine produces.

## Inputs

| Appliance | Power | Qty | Hours/day | Duty cycle | Starting surge |
|---|---|---|---|---|---|
| Frost-free fridge | 150 W | 1 | 24 h | 40% | 5× |
| Router + fiber modem | 15 W | 1 | 24 h | 100% | — |
| LED bulb | 9 W | 4 | 6 h | 100% | — |

Location: Southeast Brazil, 127 V outlet, 60 Hz. Preferred battery: LiFePO4.

## Step 1 — Energy per day

| Appliance | Math | Result |
|---|---|---|
| Fridge | 150 W × 1 × 24 h × 0.40 | **1,440 Wh** |
| Router | 15 W × 1 × 24 h × 1.00 | **360 Wh** |
| Bulbs | 9 W × 4 × 6 h × 1.00 | **216 Wh** |
| **Total** | | **2,016 Wh ≈ 2.02 kWh per day** |

For an **8-hour** blackout the math changes: the fridge and router run 8 h (480 + 120 Wh) and the bulbs their 6 h (216 Wh) — **816 Wh** in total.

## Step 2 — Battery (24-hour blackout)

1. Inverter loss: 2,016 ÷ 0.90 = **2,240 Wh** drawn from the battery.
2. Depth of discharge (LiFePO4): 2,240 ÷ 0.90 = 2,489 Wh.
3. Aging reserve: 2,489 × 1.10 = **2,738 Wh nominal** (≈ 2.74 kWh).

Because that is above 2.5 kWh, the bank moves up to **24 V**: 2,738 ÷ 24 ≈ **114 Ah**.

## Step 3 — Inverter

- Simultaneous power: 150 + 15 + 36 = **201 W**.
- Apparent power, with a 0.8 factor on the fridge motor: 150 ÷ 0.8 + 15 + 36 = **238.5 VA**.
- With the 25% margin: 238.5 × 1.25 ≈ **298 W** continuous.
- Surge: 201 W + the fridge start (150 W × 4 extra) = **801 W**.

Any **pure sine** inverter with at least ~300 W continuous and ~800 W surge will do. In practice, 1,000 W models cover it comfortably.

## Step 4 — Solar panels (Southeast)

2,240 Wh ÷ (5.0 h × 0.75 × 0.95) ≈ **629 Wp**.

The engine then looks for a real arrangement and validates the controller. For example, two 550 W modules in series would exceed a 100 V controller on a cold day (≈ 106.5 V), so that combination is discarded and another is chosen.

## Step 5 — Ready-made power station

A station rated at 1,152 Wh delivers about 1,152 × 0.85 ≈ **979 Wh** of usable energy (estimate):

- **8 hours (816 Wh):** it fits — with power and surge to spare.
- **24 hours (2,016 Wh):** it doesn't fit on its own. In that case the result shows the closest station (with how many hours it can run) and recommends a **custom system**.

## What this example teaches

- The **fridge** dominates consumption (71%). Using it less is the cheapest way to shrink the system.
- The **battery** is about **36% larger** than the consumption, because of losses, safe discharge and aging.
- **Power** and **energy** lead to different decisions: the inverter can be small; the battery can't.
