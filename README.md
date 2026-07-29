# Timer Pomodoro — vanilla vs. Lit

A mesma aplicação implementada duas vezes, para comparar as duas abordagens.

```
vanilla/     HTML, CSS e JavaScript puros, sem dependências
framework/   a mesma aplicação com o framework Lit
```

Cada pasta tem seu próprio README explicando como rodar.

A análise comparativa está em **[COMPARACAO.md](COMPARACAO.md)** (também em
[PDF](COMPARACAO.pdf)).

## Como rodar

**vanilla** — abra `vanilla/index.html` no navegador, ou sirva por HTTP.

**framework** — precisa de um servidor HTTP (o import map não funciona em `file://`):

```bash
npx serve framework
# ou
cd framework && python -m http.server 8000
```

Nenhuma das duas versões precisa de internet ou de backend.

## Funcionalidades

Idênticas nas duas versões:

- Ciclos configuráveis de foco e pausa
- Start, Pause e Reset
- Tempo exibido em `mm:ss`
- Transição automática de foco para pausa ao zerar
- Contador de pomodoros concluídos
- Configuração e contador salvos no `localStorage` (sobrevivem ao F5)
- Aviso sonoro e visual na virada de ciclo
