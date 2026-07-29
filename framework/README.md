# Timer Pomodoro - Versão Lit Framework

Esta pasta contém a implementação da aplicação Timer Pomodoro utilizando o **Lit** (versão 3.x), uma biblioteca leve para construção de Web Components rápidos e reativos.

---

## Estrutura de Arquivos

```text
framework/
├── index.html   # Ponto de entrada HTML com configuração de Import Maps
├── script.js    # Definição do Web Component <pomodoro-app> (lógica e template)
├── styles.js    # Estilos CSS encapsulados via template tag css do Lit
├── lib/
│   └── lit.js   # Bundle standalone do Lit 3.3.3 (ESM)
└── README.md    # Documentação técnica desta versão
```

---

## Mapeamento em Relação à Versão Vanilla

Para facilitar a comparação direta entre as abordagens, a organização dos arquivos acompanha a estrutura da pasta `vanilla/`:

| Arquivo Vanilla | Arquivo Lit | Função / Descrição |
|---|---|---|
| `vanilla/index.html` | `framework/index.html` | Estrutura base da página e declaração do componente `<pomodoro-app>` |
| `vanilla/script.js` | `framework/script.js` | Lógica da aplicação, temporizador e gerenciamento de estado |
| `vanilla/style.css` | `framework/styles.js` | Estilização da interface (convertida para CSS encapsulado via Lit) |

*Nota: `style.css` foi transformado em `styles.js` para ser importado como um objeto de estilos Lit (`css` tagged template), garantindo o isolamento pelo Shadow DOM.*

---

## Como Executar

Como esta versão utiliza **Import Maps** para resolução de ES Modules nativos, ela **deve ser executada via protocolo HTTP** (abrir o arquivo diretamente com `file://` causará bloqueio pelo navegador por políticas de segurança).

### Opção 1: Com Node.js / npx

```bash
npx serve framework
```

### Opção 2: Com Python 3

```bash
python -m http.server 8000
```

Após iniciar o servidor, acesse o endereço fornecido no terminal (por exemplo, `http://localhost:8000`).

---

## Arquitetura do Componente `<pomodoro-app>`

A aplicação é encapsulada em um único Custom Element reativo:

1. **Propriedades Reativas (`static properties`)**:
   Declara as variáveis de estado (`tempoFoco`, `tempoPausa`, `tempoRestante`, `pomodorosConcluidos`, `modoAtual`, `estaRodando`, `notificacoes`). Quando qualquer uma dessas propriedades é alterada, o Lit agenda e executa a re-renderização da interface de forma otimizada.

2. **Estilização Isolada (`static styles`)**:
   Importa as regras de CSS registradas em `styles.js`. Os estilos ficam restritos ao Shadow DOM do componente, prevenindo vazamentos de CSS para o documento principal ou inferências externas.

3. **Template Declarativo (`render()`)**:
   Define o HTML da aplicação utilizando a função `html` do Lit. Eventos são vinculados declarativamente (ex: `@click=${this.iniciarTimer}`) e renderizações condicionais/listas utilizam expressões JavaScript padrão (como `.map()`).

---

## Resolução de Módulos e Lit sem Bundler

O arquivo `index.html` utiliza um **Import Map** nativo para mapear a especificação do módulo `lit` ao arquivo estático local:

```html
<script type="importmap">
  {
    "imports": {
      "lit": "./lib/lit.js"
    }
  }
</script>
```

### Como o `lib/lit.js` foi gerado

Para evitar chamadas de rede a CDNs externas durante a execução e permitir funcionamento offline, o Lit 3.3.3 foi empacotado em um único arquivo ESM (aproximadamente 15 KB minificado) utilizando o `esbuild`:

```bash
npm install lit@3
echo 'export * from "lit";' > entrada.js
npx esbuild entrada.js --bundle --minify --format=esm --outfile=lib/lit.js
```

> **Por que não usar o arquivo do npm diretamente?**
> O pacote padrão do npm (`lit/index.js`) utiliza declarações de importação relativas a pacotes internos (como `@lit/reactive-element` e `lit-html`), que não são resolvidas pelo navegador sem um bundler ou import map exaustivo. O arquivo empacotado resolve todas as dependências internas em um único arquivo ESM local.

---

## Diferenças Técnicas em Relação ao Vanilla JavaScript

| Operação | Vanilla JavaScript | Lit Framework |
|---|---|---|
| **Seleção de Elementos** | Requer `document.getElementById` ou `querySelector` | Desnecessário; referências são vinculadas no template |
| **Atualização da Interface** | Função manual (ex: `atualizarInterface()`) | Automática ao mutar qualquer `property` reativa |
| **Vínculo de Eventos** | Imperativo (`element.addEventListener(...)`) | Declarativo (`@click=${this.acao}` no template HTML) |
| **Renderização de Listas** | Criação manual de nós (`createElement`, `appendChild`) | Mapeamento declarativo com `.map()` dentro do template |
| **CSS e Estilização** | CSS global afetando toda a página | CSS isolado no Shadow DOM via `css` tagged template |

---

## Observação sobre o Sinal Sonoro

O aviso sonoro de conclusão do ciclo é gerado via **Web Audio API**. Por restrições de política de autoplay dos navegadores modernos, o áudio só poderá ser reproduzido após a primeira interação do usuário com a página (ex: ao clicar no botão "Iniciar").
