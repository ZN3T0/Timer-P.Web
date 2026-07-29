# Timer Pomodoro - Vanilla JS vs. Lit Framework

Este projeto apresenta a implementação de uma aplicação de Timer Pomodoro desenvolvida sob duas abordagens distintas no ecossistema Web: **Vanilla JavaScript** (sem dependências externas) e **Lit Framework** (Web Components nativos).

O objetivo principal é demonstrar, de forma prática e comparativa, as diferenças arquiteturais, de produtividade, manutencibilidade e gerenciamento de estado entre o desenvolvimento Web tradicional e o uso de uma biblioteca moderna baseada em Web Components.

---

## Estrutura do Repositório

```text
.
├── vanilla/       # Implementação em HTML5, CSS3 e JavaScript (ES6+) puros
└── framework/     # Implementação modular utilizando Lit (Web Components)
```

Cada subdiretório possui seu próprio arquivo `README.md` detalhando as especificidades técnicas da respectiva implementação.

---

## Funcionalidades da Aplicação

Ambas as versões possuem paridade total de recursos e funcionalidades:

- **Gerenciamento de Ciclos**: Alternância automática e manual entre modos de Foco (25 min por padrão) e Pausa (5 min por padrão).
- **Controle do Temporizador**: Ações de Iniciar (Start), Pausar (Pause) e Redefinir (Reset).
- **Formatação de Tempo**: Exibição contínua do tempo no formato `mm:ss` e atualização dinâmica do título da guia (`<title>`).
- **Contador de Ciclos**: Registro incremental de Pomodoros concluídos.
- **Persistência de Dados**: Armazenamento de configurações, estados e contadores no `localStorage`.
- **Recuperação de Estado Pós-Reload**: Cálculo automático do tempo decorrido caso a página seja recarregada (`F5`) com o temporizador em execução.
- **Notificações e Avisos**: Notificações visuais em tela e sinal sonoro sintetizado via Web Audio API na conclusão de cada ciclo.

---

## Como Executar

### 1. Versão Vanilla (`vanilla/`)
A versão Vanilla não requer servidores nem etapas de compilação ou instalação:

- **Opção A**: Abra o arquivo `vanilla/index.html` diretamente no seu navegador de preferência.
- **Opção B**: Sirva a pasta via servidor HTTP local.

### 2. Versão Framework com Lit (`framework/`)
Devido ao uso de **Import Maps** (ES Modules), a versão Lit deve ser servida via protocolo HTTP:

**Utilizando Node.js (`npx`):**
```bash
npx serve framework
```

**Utilizando Python 3:**
```bash
cd framework
python -m http.server 8000
```

Após iniciar o servidor, acesse o endereço indicado no terminal (ex: `http://localhost:8000` ou `http://localhost:3000`).

---

## Resumo Comparativo

| Aspecto | Vanilla JavaScript (`vanilla/`) | Lit Framework (`framework/`) |
|---|---|---|
| **Abordagem** | Manipulação direta do DOM via Web APIs | Componentização com Web Components e Shadow DOM |
| **Gerenciamento de Estado** | Atualizações manuais da interface | Propriedades reativas (`static properties`) com renderização automática |
| **Estilização** | CSS Global (`style.css`) | Estilos encapsulados no Shadow DOM (`static styles`) |
| **Escopo de Eventos** | `addEventListener` nos elementos do DOM | Event Listeners declarativos no template (`@click`) |
| **Dependências** | Zero dependências | Lit 3.x (gerado via bundler interno, sem dependências de CDN em runtime) |

---

## Requisitos de Sistema

- Navegador web moderno compatível com ES6+ e Web Components (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
- Node.js (opcional, para execução com `npx serve`).
- Python 3 (opcional, para servidor HTTP simples).
