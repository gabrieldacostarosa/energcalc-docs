# EnergCalc — Documentação / Documentation

Site público de documentação do EnergCalc, em português e inglês.
Public documentation site for EnergCalc, in Portuguese and English.

## Estrutura / Structure

```
content/pt/*.md   páginas em português
content/en/*.md   pages in English (same slugs as PT)
scripts/build.mjs gera / builds dist/index.html (one self-contained file)
```

Cada página começa com um cabeçalho / Each page starts with front matter:

```yaml
---
slug: engine
title: Motor de cálculo
group: Como funciona
description: Uma frase sobre a página.
---
```

- O número no nome do arquivo define a ordem / The file-name number sets the order.
- PT e EN precisam ter os mesmos slugs, ou o build falha / PT and EN must share slugs, or the build fails.
- Diagramas: bloco de código ```` ```mermaid ```` / Diagrams: a ```` ```mermaid ```` code block.

## Rodar localmente / Run locally

```bash
npm ci
npm run build
npx serve dist        # ou / or: python3 -m http.server --directory dist
```

## Publicar no Netlify / Deploy to Netlify

1. Crie um repositório só para esta pasta / Create a repository for this folder only.
2. Netlify → Add new site → Import from Git → escolha o repositório / pick the repo.
3. O `netlify.toml` já define / already sets: build `npm ci && npm run build`, publish `dist`.

Alternativa sem Git / Without Git: rode `npm run build` e arraste a pasta `dist` em
app.netlify.com/drop.
