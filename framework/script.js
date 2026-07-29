import { LitElement, html } from 'lit';
import { estilos } from './styles.js';

class PomodoroApp extends LitElement {

  // Quando uma destas propriedades muda, o Lit redesenha a tela sozinho
  static properties = {
    tempoFoco: { type: Number },
    tempoPausa: { type: Number },
    tempoRestante: { type: Number },
    pomodorosConcluidos: { type: Number },
    modoAtual: { type: String },
    estaRodando: { type: Boolean },
    notificacoes: { type: Array },
  };

  static styles = estilos;

  constructor() {
    super();

    this.tempoFoco = this.obterDado('pomodoro_focus_time', 1500);
    this.tempoPausa = this.obterDado('pomodoro_break_time', 300);
    this.pomodorosConcluidos = this.obterDado('pomodoro_completed_count', 0);
    this.modoAtual = localStorage.getItem('pomodoro_modo_atual') || 'foco';
    this.tempoRestante = this.obterDado('pomodoro_tempo_restante', this.tempoFoco);
    this.estaRodando = false;
    this.notificacoes = [];

    this.intervaloTimer = null;
    this.proximoIdNotificacao = 0;

    // Se o timer estava rodando antes do F5, retoma de onde parou
    const estavaRodando = localStorage.getItem('pomodoro_esta_rodando') === 'true';
    const ultimoTimestamp = this.obterDado('pomodoro_ultimo_timestamp', 0);

    if (estavaRodando && ultimoTimestamp > 0) {
      this.recuperarTempoPassado(ultimoTimestamp);
      this.iniciarTimer();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.intervaloTimer);
  }

  obterDado(chave, valorPadrao) {
    try {
      const valor = localStorage.getItem(chave);
      if (valor !== null) {
        const numero = parseFloat(valor);
        return isNaN(numero) ? valorPadrao : numero;
      }
    } catch (e) {
      console.warn(`Erro ao ler ${chave} do localStorage:`, e);
    }
    return valorPadrao;
  }

  salvarEstado() {
    try {
      localStorage.setItem('pomodoro_focus_time', this.tempoFoco);
      localStorage.setItem('pomodoro_break_time', this.tempoPausa);
      localStorage.setItem('pomodoro_completed_count', this.pomodorosConcluidos);
      localStorage.setItem('pomodoro_modo_atual', this.modoAtual);
      localStorage.setItem('pomodoro_tempo_restante', this.tempoRestante);
      localStorage.setItem('pomodoro_esta_rodando', this.estaRodando);
      localStorage.setItem('pomodoro_ultimo_timestamp', Date.now());
    } catch (e) {
      console.warn('Erro ao salvar no localStorage:', e);
    }
  }

  // Avança os ciclos que teriam acontecido com a página fechada
  recuperarTempoPassado(ultimoTimestamp) {
    let restante = Math.floor((Date.now() - ultimoTimestamp) / 1000);
    if (restante <= 0) return;

    while (restante >= this.tempoRestante) {
      restante -= this.tempoRestante;
      this.trocarModo();
    }
    this.tempoRestante -= restante;
  }

  formatarTempo(segundosTotal) {
    const minutos = Math.floor(segundosTotal / 60);
    const segundos = segundosTotal % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  }

  iniciarTimer() {
    if (this.estaRodando) return;

    this.estaRodando = true;
    this.salvarEstado();

    this.intervaloTimer = setInterval(() => {
      this.tempoRestante--;

      if (this.tempoRestante <= 0) {
        this.tocarSomAviso();
        this.trocarModo();

        if (this.modoAtual === 'pausa') {
          this.mostrarNotificacao('Ciclo de foco concluído! Hora de descansar.', 'success');
        } else {
          this.mostrarNotificacao('Pausa concluída! Hora de focar.', 'info');
        }
      }

      this.salvarEstado();
    }, 1000);
  }

  pausarTimer() {
    if (!this.estaRodando) return;

    clearInterval(this.intervaloTimer);
    this.intervaloTimer = null;
    this.estaRodando = false;
    this.salvarEstado();
  }

  reiniciarTimer() {
    clearInterval(this.intervaloTimer);
    this.intervaloTimer = null;
    this.estaRodando = false;
    this.modoAtual = 'foco';
    this.tempoRestante = this.tempoFoco;
    this.salvarEstado();
  }

  // Alterna foco <-> pausa e conta o pomodoro quando um foco termina
  trocarModo() {
    if (this.modoAtual === 'foco') {
      this.pomodorosConcluidos++;
      this.modoAtual = 'pausa';
      this.tempoRestante = this.tempoPausa;
    } else {
      this.modoAtual = 'foco';
      this.tempoRestante = this.tempoFoco;
    }
  }

  tocarSomAviso() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const inicio = audioCtx.currentTime;

      [[523.25, 0], [659.25, 0.15]].forEach(([frequencia, atraso]) => {
        const oscilador = audioCtx.createOscillator();
        const ganho = audioCtx.createGain();

        oscilador.type = 'sine';
        oscilador.frequency.setValueAtTime(frequencia, inicio + atraso);
        ganho.gain.setValueAtTime(0.08, inicio + atraso);
        ganho.gain.exponentialRampToValueAtTime(0.001, inicio + atraso + 0.15);

        oscilador.connect(ganho);
        ganho.connect(audioCtx.destination);
        oscilador.start(inicio + atraso);
        oscilador.stop(inicio + atraso + 0.2);
      });
    } catch (erro) {
      console.warn('Alerta sonoro não pôde ser reproduzido:', erro);
    }
  }

  mostrarNotificacao(mensagem, tipo = 'success') {
    const id = this.proximoIdNotificacao++;

    // Reatribui em vez de usar .push(): o Lit compara a referência do array
    this.notificacoes = [...this.notificacoes, { id, mensagem, tipo }];

    setTimeout(() => {
      this.notificacoes = this.notificacoes.filter((n) => n.id !== id);
    }, 3000);
  }

  salvarConfiguracoes(evento) {
    evento.preventDefault();

    // renderRoot é o Shadow DOM; document.getElementById não enxerga aqui dentro
    const novoTempoFoco = parseInt(this.renderRoot.querySelector('#input-focus-time').value, 10);
    const novoTempoPausa = parseInt(this.renderRoot.querySelector('#input-break-time').value, 10);

    if (isNaN(novoTempoFoco) || novoTempoFoco < 1 || novoTempoFoco > 3600) {
      this.mostrarNotificacao('Tempo de foco deve ser entre 1 e 3600 segundos.', 'warning');
      return;
    }

    if (isNaN(novoTempoPausa) || novoTempoPausa < 1 || novoTempoPausa > 1800) {
      this.mostrarNotificacao('Tempo de pausa deve ser entre 1 e 1800 segundos.', 'warning');
      return;
    }

    this.tempoFoco = novoTempoFoco;
    this.tempoPausa = novoTempoPausa;

    this.reiniciarTimer();
    this.mostrarNotificacao('Configurações salvas com sucesso!', 'success');
  }

  render() {
    const ehPausa = this.modoAtual === 'pausa';

    // Quantas bolinhas do bloco atual de 4 aparecem preenchidas
    const preenchidas = this.pomodorosConcluidos === 0
      ? 0
      : ((this.pomodorosConcluidos - 1) % 4) + 1;

    return html`
      <div class="pomodoro-app">

        <!-- Cabeçalho -->
        <header class="pomodoro-header">
          <h1 class="pomodoro-header__title">Timer Pomodoro</h1>
          <p class="pomodoro-header__subtitle">Foque. Descanse. Repita.</p>
        </header>

        <!-- Área do timer -->
        <section class="timer-card">

          <span class="mode-badge ${ehPausa ? 'mode-badge--break' : ''}"
                role="status" aria-live="polite">
            ${ehPausa ? 'Pausa' : 'Foco'}
          </span>

          <output class="timer-display" role="timer" aria-live="off">
            ${this.formatarTempo(this.tempoRestante)}
          </output>

          <div class="timer__controls">
            <button class="btn btn--start" type="button"
                    ?disabled=${this.estaRodando}
                    @click=${this.iniciarTimer}>▶ Start</button>

            <button class="btn btn--pause" type="button"
                    ?disabled=${!this.estaRodando}
                    @click=${this.pausarTimer}>⏸ Pause</button>

            <button class="btn btn--reset" type="button"
                    @click=${() => {
                      this.reiniciarTimer();
                      this.mostrarNotificacao('Timer reiniciado.', 'info');
                    }}>↺ Reset</button>
          </div>
        </section>

        <!-- Contador de pomodoros concluídos -->
        <div class="pomodoro-counter" role="status" aria-live="polite">
          <div class="pomodoro-counter__dots">
            ${[1, 2, 3, 4].map((indice) => html`
              <span class="pomodoro-counter__dot
                           ${indice <= preenchidas ? 'pomodoro-counter__dot--filled' : ''}"></span>
            `)}
          </div>

          <p class="pomodoro-counter__label">
            Pomodoros concluídos:
            <strong class="pomodoro-counter__value">${this.pomodorosConcluidos}</strong>
          </p>
        </div>

        <!-- Configurações -->
        <section class="settings-card">
          <h2 class="settings-card__title">Configurações</h2>

          <form class="settings-form" @submit=${this.salvarConfiguracoes} novalidate>
            <div class="form-row">

              <div class="form-group">
                <label class="form-group__label" for="input-focus-time">⏱ Foco</label>
                <input id="input-focus-time" class="form-group__input" type="number"
                       min="1" max="3600" step="1" .value=${String(this.tempoFoco)} />
                <span class="form-group__suffix">segundos</span>
              </div>

              <div class="form-group">
                <label class="form-group__label" for="input-break-time">☕ Pausa</label>
                <input id="input-break-time" class="form-group__input" type="number"
                       min="1" max="1800" step="1" .value=${String(this.tempoPausa)} />
                <span class="form-group__suffix">segundos</span>
              </div>

            </div>

            <button class="btn btn--save" type="submit">Salvar Configurações</button>
          </form>
        </section>

        <!-- Área de notificações -->
        <div class="notifications-area" role="alert" aria-live="assertive">
          ${this.notificacoes.length === 0
            ? html`<p class="notifications-area__placeholder">As notificações aparecerão aqui…</p>`
            : this.notificacoes.map((n) => html`
                <div class="notification notification--${n.tipo}">${n.mensagem}</div>
              `)}
        </div>

        <!-- Rodapé -->
        <footer class="pomodoro-footer">
          <p class="pomodoro-footer__text">Técnica Pomodoro</p>
        </footer>

      </div>
    `;
  }
}

customElements.define('pomodoro-app', PomodoroApp);
