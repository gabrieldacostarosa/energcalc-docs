// Gera o site de documentação (um único index.html autocontido) a partir de content/{pt,en}/*.md
// Uso: npm run build  →  dist/index.html
import { readFileSync, readdirSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

// fileURLToPath funciona no Windows e no Linux (URL.pathname gera "/C:/..." no Windows)
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LANGS = ['pt', 'en'];
const UI = {
  pt: { search: 'Buscar na documentação…', onThisPage: 'Nesta página', prev: 'Anterior', next: 'Próxima', noResults: 'Nada encontrado', menu: 'Menu', theme: 'Tema', docs: 'Documentação', updated: 'Atualizado em', lang: 'English', langCode: 'EN', skip: 'Pular para o conteúdo', site: 'EnergCalc — documentação pública' },
  en: { search: 'Search the docs…', onThisPage: 'On this page', prev: 'Previous', next: 'Next', noResults: 'No results', menu: 'Menu', theme: 'Theme', docs: 'Documentation', updated: 'Updated', lang: 'Português', langCode: 'PT', skip: 'Skip to content', site: 'EnergCalc — public documentation' },
};

const slugify = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const escapeHtml = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const pages = {};
for (const lang of LANGS) {
  const dir = join(ROOT, 'content', lang);
  pages[lang] = readdirSync(dir).filter(f => f.endsWith('.md')).sort().map(f => {
    const { data, content } = matter(readFileSync(join(dir, f), 'utf8'));
    const headings = [];
    const renderer = new marked.Renderer();
    renderer.heading = ({ tokens, depth }) => {
      const text = marked.Parser.parseInline(tokens);
      const id = `${data.slug}--${slugify(text)}`;
      if (depth === 2) headings.push({ id, text: text.replace(/<[^>]+>/g, '') });
      return depth === 1 ? `<h1>${text}</h1>` : `<h${depth} id="${id}"><a class="anchor" href="#${lang}-${data.slug}" data-scroll="${id}" aria-hidden="true">#</a>${text}</h${depth}>`;
    };
    renderer.code = ({ text, lang: l }) => l === 'mermaid'
      ? `<div class="diagram"><pre class="mermaid">${escapeHtml(text)}</pre></div>`
      : `<pre><code>${escapeHtml(text)}</code></pre>`;
    renderer.table = function (token) { return `<div class="table-wrap">${marked.Renderer.prototype.table.call(this, token)}</div>`; };
    renderer.link = ({ href, tokens }) => {
      const text = marked.Parser.parseInline(tokens);
      const external = /^https?:/.test(href);
      return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
    };
    const html = marked.parse(content, { renderer, gfm: true });
    const plain = content.replace(/```[\s\S]*?```/g, ' ').replace(/[#*`>|\-\[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
    return { slug: data.slug, title: data.title, group: data.group, description: data.description, html, headings, text: plain };
  });
}
// mesmos slugs nos dois idiomas
const slugsPt = pages.pt.map(p => p.slug).join(','), slugsEn = pages.en.map(p => p.slug).join(',');
if (slugsPt !== slugsEn) throw new Error(`Slugs diferentes entre PT e EN:\n${slugsPt}\n${slugsEn}`);

const data = { pages, ui: UI, updated: new Date().toISOString().slice(0, 10), version: JSON.parse(readFileSync(join(ROOT, 'package.json'))).version };

const html = `<!DOCTYPE html>
<html lang="pt-BR" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>EnergCalc — Documentação / Documentation</title>
<meta name="description" content="Documentação pública do EnergCalc: como funciona o cálculo de bateria, inversor e painéis solares para apagões. Public documentation of EnergCalc.">
<meta name="theme-color" content="#0D0D0D">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0D0D0D"/><path d="M18 3 7 18h7l-2 11 11-16h-7z" fill="#FFB800"/></svg>')}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{--bg:#0D0D0D;--bg2:#141414;--bg3:#1C1C1C;--line:#2A2A2A;--text:#E6E7EA;--text2:#A9AFB8;--head:#F4F4F6;--accent:#FF5500;--amber:#FFB800;--green:#5E9B69;--code:#1A1A1A;--shadow:0 10px 40px -10px #000c}
[data-theme=light]{--bg:#FFFFFF;--bg2:#F7F7F8;--bg3:#EFEFF1;--line:#E3E4E8;--text:#2A2D34;--text2:#5E6470;--head:#0D0D0D;--accent:#E04A00;--amber:#B57E00;--green:#2F6B3A;--code:#F3F3F5;--shadow:0 10px 30px -12px #0003}
*{box-sizing:border-box}html{scroll-padding-top:76px}
body{margin:0;background:var(--bg);color:var(--text);font:400 16px/1.7 "IBM Plex Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
.skip{position:absolute;left:-999px}.skip:focus{left:12px;top:12px;z-index:99;background:var(--accent);color:#fff;padding:8px 12px;border-radius:6px}
#content:focus{outline:none}
header.top{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:14px;height:60px;padding:0 20px;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.brand{display:flex;align-items:center;gap:8px;font:700 22px/1 "Barlow Condensed",sans-serif;text-transform:uppercase;letter-spacing:.03em;color:var(--head);white-space:nowrap}
.brand b{color:var(--accent)}.brand small{font:500 11px "IBM Plex Mono",monospace;color:var(--text2);text-transform:uppercase;letter-spacing:.1em;margin-left:6px}
.search{position:relative;flex:1;max-width:440px;margin-left:auto}
.search input{width:100%;background:var(--bg2);border:1px solid var(--line);color:var(--text);border-radius:8px;padding:9px 12px 9px 34px;font:inherit;font-size:14px}
.search input:focus{outline:2px solid var(--amber);outline-offset:1px}
.search:before{content:"⌕";position:absolute;left:11px;top:6px;color:var(--text2);font-size:18px}
.results{position:absolute;top:44px;left:0;right:0;background:var(--bg2);border:1px solid var(--line);border-radius:10px;box-shadow:var(--shadow);max-height:60vh;overflow:auto;display:none}
.results.open{display:block}.results a{display:block;padding:10px 14px;border-bottom:1px solid var(--line);color:var(--text)}.results a:hover,.results a.sel{background:var(--bg3);text-decoration:none}
.results b{color:var(--head)}.results span{display:block;font-size:13px;color:var(--text2)}.results mark{background:none;color:var(--amber);font-weight:600}
.btn{background:var(--bg2);border:1px solid var(--line);color:var(--text);border-radius:8px;padding:8px 11px;font:500 13px "IBM Plex Mono",monospace;cursor:pointer;white-space:nowrap}
.btn:hover{border-color:var(--amber);color:var(--amber)}.menu-btn{display:none}
.layout{display:grid;grid-template-columns:260px minmax(0,1fr) 220px;max-width:1360px;margin:0 auto}
nav.side{position:sticky;top:60px;height:calc(100vh - 60px);overflow:auto;padding:24px 16px 40px 20px;border-right:1px solid var(--line)}
nav.side h4{margin:22px 0 6px;font:600 11px "IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.14em;color:var(--amber)}
nav.side h4:first-child{margin-top:0}
nav.side a{display:block;padding:6px 10px;border-radius:6px;color:var(--text2);font-size:14.5px;line-height:1.35}
nav.side a:hover{background:var(--bg2);color:var(--head);text-decoration:none}nav.side a.active{background:var(--bg3);color:var(--head);box-shadow:inset 2px 0 0 var(--accent)}
main{padding:36px 48px 80px;min-width:0}
main h1{font:700 clamp(36px,5vw,54px)/1.02 "Barlow Condensed",sans-serif;text-transform:uppercase;color:var(--head);margin:0 0 10px;letter-spacing:.01em}
.lead{color:var(--text2);font-size:18px;margin:0 0 28px;padding-bottom:22px;border-bottom:1px solid var(--line)}
main h2{font:700 30px/1.15 "Barlow Condensed",sans-serif;text-transform:uppercase;color:var(--head);margin:44px 0 12px;letter-spacing:.01em}
main h3{font:600 20px/1.3 "IBM Plex Sans",sans-serif;color:var(--head);margin:30px 0 8px}
.anchor{opacity:0;margin-left:-22px;padding-right:8px;color:var(--text2)}h2:hover .anchor,h3:hover .anchor{opacity:1;text-decoration:none}
main p,main li{max-width:72ch}main strong{color:var(--head);font-weight:600}
main ul,main ol{padding-left:22px}main li{margin:4px 0}
code{font:500 .88em "IBM Plex Mono",monospace;background:var(--code);border:1px solid var(--line);border-radius:5px;padding:2px 6px;color:var(--head)}
pre{background:var(--code);border:1px solid var(--line);border-radius:10px;padding:14px 16px;overflow:auto}pre code{border:0;padding:0;background:none}
blockquote{margin:20px 0;padding:12px 18px;border-left:3px solid var(--green);background:var(--bg2);border-radius:0 8px 8px 0;color:var(--text)}blockquote p{margin:4px 0}
.table-wrap{overflow-x:auto;margin:18px 0;border:1px solid var(--line);border-radius:10px}
table{border-collapse:collapse;width:100%;font-size:14.5px}th{background:var(--bg2);color:var(--head);text-align:left;font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:.04em}
th,td{padding:10px 14px;border-bottom:1px solid var(--line);vertical-align:top}tr:last-child td{border-bottom:0}
.diagram{margin:22px 0;padding:18px;border:1px solid var(--line);border-radius:12px;background:var(--bg2);overflow-x:auto;text-align:center}
.diagram pre.mermaid{background:none;border:0;margin:0;padding:0;font:13px "IBM Plex Mono",monospace;color:var(--text2);text-align:left}
.diagram pre.mermaid[data-processed]{text-align:center}
.pager{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:56px}
.pager a{display:block;border:1px solid var(--line);border-radius:10px;padding:14px 16px;color:var(--head)}.pager a:hover{border-color:var(--accent);text-decoration:none}
.pager small{display:block;color:var(--text2);font:500 11px "IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.12em}.pager .next{text-align:right;grid-column:2}
aside.toc{position:sticky;top:60px;height:calc(100vh - 60px);overflow:auto;padding:36px 20px;font-size:13.5px}
aside.toc h5{margin:0 0 10px;font:600 11px "IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.14em;color:var(--text2)}
aside.toc a{display:block;padding:4px 0 4px 10px;color:var(--text2);border-left:2px solid var(--line)}aside.toc a:hover{color:var(--head);text-decoration:none}aside.toc a.on{color:var(--head);border-left-color:var(--accent)}
footer.foot{border-top:1px solid var(--line);padding:22px 48px;color:var(--text2);font-size:13px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
@media (max-width:1180px){.layout{grid-template-columns:240px minmax(0,1fr)}aside.toc{display:none}}
@media (max-width:820px){.layout{grid-template-columns:1fr}nav.side{position:fixed;top:60px;left:0;bottom:0;width:86vw;max-width:320px;height:auto;background:var(--bg);z-index:30;transform:translateX(-102%);transition:transform .2s;box-shadow:var(--shadow)}
nav.side.open{transform:none}.menu-btn{display:inline-block}main{padding:26px 18px 60px}.brand small{display:none}.search{max-width:none}footer.foot{padding:18px}header.top{gap:8px;padding:0 12px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
@media print{header.top,nav.side,aside.toc,.pager{display:none}.layout{display:block}}
</style>
</head>
<body>
<a class="skip" href="#content" id="skip"></a>
<header class="top">
  <button class="btn menu-btn" id="menuBtn" aria-controls="side" aria-expanded="false">☰</button>
  <a class="brand" id="home" href="#"><span style="color:var(--amber)">⚡</span>Energ<b>Calc</b><small id="docsLabel"></small></a>
  <div class="search" role="search"><input id="q" type="search" autocomplete="off" aria-label="search"><div class="results" id="results" role="listbox"></div></div>
  <button class="btn" id="langBtn" title="Language / Idioma"></button>
  <button class="btn" id="themeBtn" aria-label="theme">◐</button>
</header>
<div class="layout">
  <nav class="side" id="side" aria-label="docs"></nav>
  <main id="content" tabindex="-1"></main>
  <aside class="toc" id="toc"></aside>
</div>
<footer class="foot"><span id="footL"></span><span id="footR"></span></footer>
<script id="docs-data" type="application/json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
<script>
(function(){
  var D = JSON.parse(document.getElementById('docs-data').textContent);
  var store = { get: function(k){ try { return localStorage.getItem(k); } catch(e) { return null; } }, set: function(k,v){ try { localStorage.setItem(k,v); } catch(e) {} } };
  var $ = function(id){ return document.getElementById(id); };
  var lang = 'pt', slug = 'intro', mermaidMod = null;

  var theme = store.get('ecdocs.theme') || 'dark';
  document.documentElement.dataset.theme = theme;
  $('themeBtn').onclick = function(){ theme = theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = theme; store.set('ecdocs.theme', theme); render(); };

  function parse(){
    var h = location.hash.replace('#','');
    var m = /^(pt|en)-([a-z0-9-]+)$/.exec(h);
    if (m) { lang = m[1]; slug = m[2]; return; }
    var saved = store.get('ecdocs.lang');
    lang = saved || ((navigator.language||'').toLowerCase().indexOf('pt') === 0 ? 'pt' : 'en');
    slug = 'intro';
  }
  function pagesOf(l){ return D.pages[l]; }
  function ordered(l){ // ordem do menu: grupos na ordem em que aparecem
    var groups = [], by = {};
    pagesOf(l).forEach(function(p){ if(!by[p.group]){ by[p.group]=[]; groups.push(p.group);} by[p.group].push(p); });
    var list = []; groups.forEach(function(g){ list = list.concat(by[g]); });
    return { groups: groups, by: by, list: list };
  }
  function go(l, s){ var h = '#'+l+'-'+s; if (location.hash === h) render(); else location.hash = h; }

  function render(){
    var ui = D.ui[lang], o = ordered(lang);
    var page = o.list.filter(function(p){ return p.slug === slug; })[0] || o.list[0];
    slug = page.slug;
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.title = page.title + ' — EnergCalc ' + ui.docs;
    store.set('ecdocs.lang', lang);
    $('docsLabel').textContent = ui.docs; $('skip').textContent = ui.skip;
    $('langBtn').textContent = ui.langCode; $('langBtn').title = ui.lang;
    $('q').placeholder = ui.search;
    $('footL').textContent = ui.site + ' · v' + D.version;
    $('footR').textContent = ui.updated + ' ' + D.updated;

    $('side').innerHTML = o.groups.map(function(g){
      return '<h4>'+g+'</h4>' + o.by[g].map(function(p){ return '<a href="#'+lang+'-'+p.slug+'"'+(p.slug===slug?' class="active" aria-current="page"':'')+'>'+p.title+'</a>'; }).join('');
    }).join('');

    var i = o.list.indexOf(page), prev = o.list[i-1], next = o.list[i+1];
    $('content').innerHTML = page.html.replace('</h1>', '</h1><p class="lead">'+page.description+'</p>') +
      '<nav class="pager">' + (prev ? '<a href="#'+lang+'-'+prev.slug+'"><small>← '+ui.prev+'</small>'+prev.title+'</a>' : '<span></span>') +
      (next ? '<a class="next" href="#'+lang+'-'+next.slug+'"><small>'+ui.next+' →</small>'+next.title+'</a>' : '') + '</nav>';

    $('toc').innerHTML = page.headings.length ? '<h5>'+ui.onThisPage+'</h5>' + page.headings.map(function(h){ return '<a href="#'+lang+'-'+slug+'" data-scroll="'+h.id+'">'+h.text+'</a>'; }).join('') : '';
    $('side').classList.remove('open'); $('menuBtn').setAttribute('aria-expanded','false');
    drawDiagrams();
  }

  // rolagem para seções sem mudar o hash (o hash identifica só a página)
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('[data-scroll]');
    if (!a) return;
    e.preventDefault();
    var el = document.getElementById(a.getAttribute('data-scroll'));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  function drawDiagrams(){
    var nodes = Array.prototype.slice.call(document.querySelectorAll('pre.mermaid'));
    if (!nodes.length) return;
    var run = function(m){
      m.initialize({ startOnLoad:false, securityLevel:'strict', theme: theme==='dark' ? 'dark' : 'neutral', themeVariables: { fontFamily:'IBM Plex Sans, sans-serif', primaryColor: theme==='dark' ? '#1C1C1C' : '#F7F7F8', primaryBorderColor:'#FF5500', lineColor: theme==='dark' ? '#A9AFB8' : '#5E6470', primaryTextColor: theme==='dark' ? '#F4F4F6' : '#0D0D0D' } });
      m.run({ nodes: nodes }).catch(function(){});
    };
    if (mermaidMod) return run(mermaidMod);
    import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs').then(function(mod){ mermaidMod = mod.default; run(mermaidMod); }).catch(function(){ /* sem internet: mostra o texto do diagrama */ });
  }

  // busca
  var q = $('q'), res = $('results'), sel = -1;
  function esc(s){ return s.replace(/[&<>]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]; }); }
  function norm(s){ return s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,''); }
  function search(){
    var term = norm(q.value.trim()); sel = -1;
    if (term.length < 2) { res.classList.remove('open'); return; }
    var words = term.split(/\\s+/);
    var hits = pagesOf(lang).map(function(p){
      var hay = norm(p.title+' '+p.description+' '+p.text), score = 0;
      for (var w=0; w<words.length; w++){ if (hay.indexOf(words[w]) < 0) return null; score += (norm(p.title).indexOf(words[w])>=0 ? 10 : 0) + (norm(p.description).indexOf(words[w])>=0 ? 4 : 0) + 1; }
      var idx = norm(p.text).indexOf(words[0]), snip = idx >= 0 ? p.text.substr(Math.max(0, idx-50), 140) : p.description;
      return { p:p, score:score, snip:snip };
    }).filter(Boolean).sort(function(a,b){ return b.score-a.score; }).slice(0,8);
    res.innerHTML = hits.length ? hits.map(function(h){
      var s = esc(h.snip); words.forEach(function(w){ s = s.replace(new RegExp('('+w.replace(/[.*+?^\${}()|[\\]\\\\]/g,'\\\\$&')+')','ig'), '<mark>$1</mark>'); });
      return '<a href="#'+lang+'-'+h.p.slug+'" role="option"><b>'+h.p.title+'</b><span>…'+s+'…</span></a>'; }).join('')
      : '<a><span>'+D.ui[lang].noResults+'</span></a>';
    res.classList.add('open');
  }
  q.addEventListener('input', search);
  q.addEventListener('keydown', function(e){
    var items = res.querySelectorAll('a[href]');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, Math.min(items.length-1, sel + (e.key==='ArrowDown'?1:-1))); items.forEach(function(a,i){ a.classList.toggle('sel', i===sel); }); }
    if (e.key === 'Enter' && items[Math.max(sel,0)]) { location.hash = items[Math.max(sel,0)].getAttribute('href'); q.value=''; res.classList.remove('open'); }
    if (e.key === 'Escape') { q.value=''; res.classList.remove('open'); }
  });
  res.addEventListener('click', function(){ q.value=''; res.classList.remove('open'); });
  document.addEventListener('keydown', function(e){ if (e.key === '/' && document.activeElement !== q) { e.preventDefault(); q.focus(); } });
  document.addEventListener('click', function(e){ if (!e.target.closest('.search')) res.classList.remove('open'); });

  $('langBtn').onclick = function(){ go(lang === 'pt' ? 'en' : 'pt', slug); };
  $('home').onclick = function(e){ e.preventDefault(); go(lang, 'intro'); };
  $('menuBtn').onclick = function(){ var o = $('side').classList.toggle('open'); this.setAttribute('aria-expanded', o); };

  // destaque da seção atual no sumário
  var spy = null;
  function watch(){
    if (spy) spy.disconnect();
    if (!('IntersectionObserver' in window)) return;
    spy = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting) { document.querySelectorAll('#toc a').forEach(function(a){ a.classList.toggle('on', a.getAttribute('data-scroll') === en.target.id); }); } });
    }, { rootMargin: '-70px 0px -70% 0px' });
    document.querySelectorAll('main h2[id]').forEach(function(h){ spy.observe(h); });
  }

  window.addEventListener('hashchange', function(){ parse(); render(); watch(); window.scrollTo(0,0); $('content').focus({ preventScroll: true }); });
  parse(); render(); watch();
})();
</script>
</body>
</html>`;

mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist', 'index.html'), html);
try { copyFileSync(join(ROOT, 'netlify.toml'), join(ROOT, 'dist', 'netlify.toml')); } catch { /* opcional */ }
console.log(`dist/index.html — ${LANGS.map(l => `${l}: ${pages[l].length} páginas`).join(', ')} — ${(html.length / 1024).toFixed(0)} KB`);
