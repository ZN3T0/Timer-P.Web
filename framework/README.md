# Timer Pomodoro — versão com Lit

A mesma aplicação da pasta `vanilla/`, reescrita com o framework **Lit** (Web Components).

## Estrutura

```
framework/
├── index.html   → carrega o Lit e o componente
├── script.js    → o componente <pomodoro-app> (lógica + template)
├── styles.js    → os estilos do componente
├── lib/
│   └── lit.js   → o framework Lit (dependência, não é código nosso)
└── README.md
```

A organização acompanha a da pasta `vanilla/`, arquivo por arquivo:

| `vanilla/` | `framework/` | |
|---|---|---|
| `index.html` | `index.html` | a página |
| `script.js` | `script.js` | a lógica |
| `style.css` | `styles.js` | os estilos |

O CSS vira `styles.js` (e não `style.css`) porque no Lit ele é escrito com a
template tag `css` e importado pelo componente — assim fica isolado no Shadow DOM.

## Como executar

O import map exige que a página seja servida por HTTP (abrir o arquivo direto
com duplo clique **não funciona**).

```bash
npx serve framework
```

Ou, com Python:

```bash
python -m http.server 8000
```

Depois abra o endereço mostrado no terminal.

Não precisa de internet: o Lit está em `lib/lit.js`, dentro do projeto.

> O aviso sonoro (Web Audio API) só toca depois da primeira interação com a
> página — é uma política de segurança dos navegadores.

## Como o Lit é carregado sem bundler

O `script.js` importa `from 'lit'`, exatamente como faria num projeto com
bundler. O **import map** no `index.html` resolve esse nome para o arquivo local:

```html
<script type="importmap">
  { "imports": { "lit": "./lib/lit.js" } }
</script>
```

O `lib/lit.js` é o **Lit 3.3.3**, baixado do npm e empacotado num arquivo único
(15 KB) para não depender de internet — importante porque a apresentação é ao
vivo. Foi gerado assim:

```bash
npm install lit@3
echo 'export * from "lit";' > entrada.js
npx esbuild entrada.js --bundle --minify --format=esm --outfile=lib/lit.js
```

> **Por que não usar o arquivo do npm direto?** Porque `lit@3/index.js` contém
> `import "@lit/reactive-element"` e `import "lit-html"` — nomes que só um
> bundler sabe resolver; o navegador dá 404. É preciso um arquivo já empacotado,
> seja o `+esm` de uma CDN ou um gerado localmente, como fizemos.

## O componente

Tudo vive em `<pomodoro-app>`:

- **`static properties`** — o estado reativo (`tempoRestante`, `modoAtual`,
  `estaRodando`, `notificacoes`…). Quando um deles muda, o Lit redesenha sozinho.
- **`static styles`** — recebe os estilos importados de `styles.js`. Ficam
  isolados dentro do componente (Shadow DOM), sem vazar para o resto da página.
- **`render()`** — o HTML, escrito com a template tag `html`.

## Diferenças em relação ao vanilla

| | vanilla | Lit |
|---|---|---|
| Buscar elementos | `document.getElementById(...)` | não precisa |
| Atualizar a tela | `atualizarInterface()` manual | automático ao mudar uma property |
| Eventos | `addEventListener` | `@click=${...}` no template |
| Classes condicionais | `classList.add/remove` | interpolação no template |
| Lista de notificações | `createElement` + `remove()` | `.map()` sobre um array |
| CSS | `style.css` global | `static styles` isolado no componente |

O comportamento é o mesmo: ciclos de foco/pausa, contador de pomodoros,
configuração de tempos, notificações, som de aviso, e o estado é salvo no
`localStorage` (inclusive recalculando os ciclos que passaram se a página for
recarregada com o timer rodando).
