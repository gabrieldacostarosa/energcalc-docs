---
slug: privacy-security
title: Privacy and security
group: Technology
description: What data exists, what it's for and how it's protected.
---

# Privacy and security

## What data EnergCalc uses

| Data | When | What for |
|---|---|---|
| **Anonymous browsing** (pages, clicks, traffic source, device type) | While using the site | Measuring and improving the site. Tied to a random identifier, with no name or email. |
| **Energy project** (appliances, hours, region) | When calculating | Producing the result and the report. |
| **Sign-up** (name, email, optional WhatsApp) | At purchase | Delivering the report and providing support. |
| **Payment** | At Mercado Pago | Processed by Mercado Pago. EnergCalc never sees card data. |
| **Offer control** (device, network and email identifiers) | When calculating and buying | Applying the per-person offer. Stored **irreversibly (hashed)** and deleted within 90 days. |

EnergCalc does **not** collect precise location, does **not** sell data and **honors** the browser's "Do Not Track" signal for metrics.

## Rights (Brazil's LGPD)

You can ask to access, correct or delete your data at any time through the site's contact channel.

## How data is protected

| Protection | In plain terms |
|---|---|
| **Database access rules** | Each person sees only their own data. Even a well-formed request for someone else's data comes back empty. |
| **Decisions on the server** | Price, the official calculation and report unlocking never depend on the browser. |
| **Payment confirmed at the source** | Unlocking depends on a confirmation fetched directly from Mercado Pago, with signature verification and an amount check. |
| **Immutable records** | Calculations and report versions can't be changed once stored. |
| **Private PDFs** | Delivered through temporary links, only to you, the buyer. |
| **Confirmed email** | The portal opens only after you prove you own the email. |
| **Protected administration** | Admin permission lives in the database and can't be self-granted. |
| **Audit trail** | Admin changes (prices, unlocks, refunds) are logged with author and date. |
| **Secrets kept off the site** | Service keys live only on the server, never in browser code. |

> This page describes security principles. Implementation details that could help someone bypass the protections are not published.
