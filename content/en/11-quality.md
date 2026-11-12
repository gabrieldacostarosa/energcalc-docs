---
slug: quality
title: Quality and testing
group: Technology
description: How calculations and rules are verified before each release.
---

# Quality and testing

EnergCalc treats every formula as a promise: it needs a test case with an expected result worked out by hand.

## Automated tests (68)

| Group | What it checks |
|---|---|
| **Consumption** | One load, many loads, duty cycle, measured consumption, standby, short and long blackouts, priorities. |
| **Battery and current** | Losses without double counting, depth of discharge, temperature, Ah, bank voltage, BMS limits, missing data. |
| **Inverter** | Continuous, apparent and surge power; loads that don't run together; waveform; voltage and frequency. |
| **Solar and controller** | Panel power, worst month, recharge time, cold-weather voltage, hot-weather voltage, current, controller compatibility. |
| **Power stations** | Estimated usable energy, undocumented surge, extra batteries, recommendation choice. |
| **Offer** | Every price tier, the regular price and the one-time last chance. |
| **Report** | All 24 sections, bill of materials matching the configuration, every message translated. |
| **Engineering milestone** | Fridge + internet + lights for 8 h, 24 h and with solar; deterministic results. |

## Other checks

- **Strict types (TypeScript)** across the site, the engine and the server functions.
- **Access rules tested on a real PostgreSQL database**, simulating a visitor, a buyer, an admin and an intruder.
- **Browser tests** through the calculator, result, offer, portal and dashboard, on desktop and mobile.
- **Tracking validated end to end:** events generated in the browser were captured and written to the database with the access rules active.
- **PDF report generated and reviewed** page by page.

## Quality rules

- Intermediate values are never rounded; only what's displayed.
- Invalid input (more than 24 hours, negative power, non-numeric values) is rejected, never silently "fixed".
- A release is ready only when every test passes.
