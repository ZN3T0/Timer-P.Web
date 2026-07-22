// Função para inicializar o Timer Pomodoro
function inicializarTimerApp() {
  const pomodoroApp = document.getElementById('pomodoro-app');
  const modeBadge = document.getElementById('mode-badge');
  const timerDisplay = document.getElementById('timer-display');
  const btnStart = document.getElementById('btn-start');
  const btnPause = document.getElementById('btn-pause');
  const btnReset = document.getElementById('btn-reset');
  const pomodoroCount = document.getElementById('pomodoro-count');
  const settingsForm = document.getElementById('settings-form');
  const inputFocusTime = document.getElementById('input-focus-time');
  const inputBreakTime = document.getElementById('input-break-time');
  const notificationsArea = document.getElementById('notifications-area');
  const notificationsPlaceholder = document.getElementById('notifications-placeholder');

  // Função para ler dados do localStorage de forma segura
  function obterDado(chave, valorPadrao) {
    try {
      const valor = localStorage.getItem(chave);
      if (valor !== null) {
        const numero = parseInt(valor, 10);
        return isNaN(numero) ? valorPadrao : numero;
      }
    } catch (e) {
      console.warn(`Erro ao ler ${chave} do localStorage:`, e);
    }
    return valorPadrao;
  }

  // Função para salvar dados no localStorage de forma segura
  function salvarDado(chave, valor) {
    try {
      localStorage.setItem(chave, valor);
    } catch (e) {
      console.warn(`Erro ao salvar ${chave} no localStorage:`, e);
    }
  }

  let tempoFoco = obterDado('pomodoro_focus_time', 25);
  let tempoPausa = obterDado('pomodoro_break_time', 5);
  let pomodorosConcluidos = obterDado('pomodoro_completed_count', 0);

  // Estados adicionais restaurados do localStorage para sobreviver ao F5
  let modoAtual = localStorage.getItem('pomodoro_modo_atual') || 'foco';
  let tempoRestante = obterDado('pomodoro_tempo_restante', tempoFoco * 60);
  let estaRodandoSalvo = localStorage.getItem('pomodoro_esta_rodando') === 'true';
  let estaPausado = localStorage.getItem('pomodoro_esta_pausado') === 'true';
  let ultimoTimestamp = obterDado('pomodoro_ultimo_timestamp', 0);

  let intervaloTimer = null;
  let estaRodando = false;

  if (inputFocusTime) inputFocusTime.value = tempoFoco;
  if (inputBreakTime) inputBreakTime.value = tempoPausa;

  // Função para tocar o som de alerta na transição do timer
  function tocarSomAviso() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const tempoInicio = audioCtx.currentTime;

      const oscilador1 = audioCtx.createOscillator();
      const ganho1 = audioCtx.createGain();
      oscilador1.type = 'sine';
      oscilador1.frequency.setValueAtTime(523.25, tempoInicio);
      ganho1.gain.setValueAtTime(0.08, tempoInicio);
      ganho1.gain.exponentialRampToValueAtTime(0.001, tempoInicio + 0.15);
      oscilador1.connect(ganho1);
      ganho1.connect(audioCtx.destination);
      oscilador1.start(tempoInicio);
      oscilador1.stop(tempoInicio + 0.15);

      const oscilador2 = audioCtx.createOscillator();
      const ganho2 = audioCtx.createGain();
      oscilador2.type = 'sine';
      oscilador2.frequency.setValueAtTime(659.25, tempoInicio + 0.15);
      ganho2.gain.setValueAtTime(0.08, tempoInicio + 0.15);
      ganho2.gain.exponentialRampToValueAtTime(0.001, tempoInicio + 0.35);
      oscilador2.connect(ganho2);
      ganho2.connect(audioCtx.destination);
      oscilador2.start(tempoInicio + 0.15);
      oscilador2.stop(tempoInicio + 0.35);
    } catch (erro) {
      console.warn('Alerta sonoro não pôde ser reproduzido:', erro);
    }
  }

  // Função para criar e exibir uma notificação na tela
  function mostrarNotificacao(mensagem, tipo = 'success') {
    if (!notificationsArea) return;
    if (notificationsPlaceholder) {
      notificationsPlaceholder.style.display = 'none';
    }

    const notificacao = document.createElement('div');
    notificacao.className = `notification notification--${tipo}`;
    notificacao.textContent = mensagem;

    notificationsArea.appendChild(notificacao);

    setTimeout(() => {
      notificacao.remove();
      const notificacoesAtivas = notificationsArea.querySelectorAll('.notification');
      if (notificacoesAtivas.length === 0 && notificationsPlaceholder) {
        notificationsPlaceholder.style.display = '';
      }
    }, 3000);
  }

  // Função para formatar o tempo em minutos e segundos (mm:ss)
  function formatarTempo(segundosTotal) {
    const minutos = Math.floor(segundosTotal / 60);
    const segundos = segundosTotal % 60;
    const minFormatado = minutos < 10 ? `0${minutos}` : minutos;
    const segFormatado = segundos < 10 ? `0${segundos}` : segundos;
    return `${minFormatado}:${segFormatado}`;
  }

  // Função para atualizar a interface visível do DOM
  function atualizarInterface() {
    if (timerDisplay) timerDisplay.textContent = formatarTempo(tempoRestante);

    if (modeBadge) {
      if (modoAtual === 'foco') {
        modeBadge.textContent = 'Foco';
        modeBadge.classList.remove('timer__mode-badge--break');
      } else {
        modeBadge.textContent = 'Pausa';
        modeBadge.classList.add('timer__mode-badge--break');
      }
    }

    if (pomodoroApp) {
      pomodoroApp.classList.remove('is-running', 'is-paused', 'is-break');
      if (estaRodando) {
        pomodoroApp.classList.add('is-running');
      } else if (estaPausado) {
        pomodoroApp.classList.add('is-paused');
      }
      if (modoAtual === 'pausa') {
        pomodoroApp.classList.add('is-break');
      }
    }

    if (btnStart) btnStart.disabled = estaRodando;
    if (btnPause) btnPause.disabled = !estaRodando;

    if (pomodoroCount) pomodoroCount.textContent = pomodorosConcluidos;

    const dots = document.querySelectorAll('.pomodoro-counter__dot');
    const preencherAte = pomodorosConcluidos === 0 ? 0 : ((pomodorosConcluidos - 1) % 4) + 1;

    dots.forEach(dot => {
      const indiceDot = parseInt(dot.getAttribute('data-dot-index'), 10);
      if (indiceDot <= preencherAte) {
        dot.classList.add('pomodoro-counter__dot--filled');
      } else {
        dot.classList.remove('pomodoro-counter__dot--filled');
      }
    });
  }

  // Função para iniciar o cronômetro do timer
  function iniciarTimer() {
    if (estaRodando) return;

    estaRodando = true;
    estaPausado = false;
    
    // Salvar estados de execução no localStorage
    salvarDado('pomodoro_esta_rodando', 'true');
    salvarDado('pomodoro_esta_pausado', 'false');
    salvarDado('pomodoro_modo_atual', modoAtual);
    salvarDado('pomodoro_ultimo_timestamp', Date.now());
    
    atualizarInterface();

    intervaloTimer = setInterval(() => {
      tempoRestante--;
      
      // Atualizar o tempo restante e o timestamp a cada segundo
      salvarDado('pomodoro_tempo_restante', tempoRestante);
      salvarDado('pomodoro_ultimo_timestamp', Date.now());

      if (tempoRestante <= 0) {
        clearInterval(intervaloTimer);
        intervaloTimer = null;
        tocarSomAviso();

        if (modoAtual === 'foco') {
          pomodorosConcluidos++;
          salvarDado('pomodoro_completed_count', pomodorosConcluidos);
          
          modoAtual = 'pausa';
          tempoRestante = tempoPausa * 60;
          mostrarNotificacao('Ciclo de foco concluído! Hora de descansar.', 'success');
        } else {
          modoAtual = 'foco';
          tempoRestante = tempoFoco * 60;
          mostrarNotificacao('Pausa concluída! Hora de focar.', 'info');
        }

        salvarDado('pomodoro_modo_atual', modoAtual);
        salvarDado('pomodoro_tempo_restante', tempoRestante);
        salvarDado('pomodoro_esta_rodando', 'false');
        salvarDado('pomodoro_esta_pausado', 'false');

        estaRodando = false;
        iniciarTimer();
      } else {
        atualizarInterface();
      }
    }, 1000);
  }

  // Função para pausar a contagem regressiva
  function pausarTimer() {
    if (!estaRodando) return;

    clearInterval(intervaloTimer);
    intervaloTimer = null;
    estaRodando = false;
    estaPausado = true;

    // Salvar estados de pausa no localStorage
    salvarDado('pomodoro_esta_rodando', 'false');
    salvarDado('pomodoro_esta_pausado', 'true');
    salvarDado('pomodoro_tempo_restante', tempoRestante);
    salvarDado('pomodoro_ultimo_timestamp', Date.now());

    atualizarInterface();
  }

  // Função para reiniciar o timer para o início do foco
  function reiniciarTimer() {
    clearInterval(intervaloTimer);
    intervaloTimer = null;
    estaRodando = false;
    estaPausado = false;
    modoAtual = 'foco';
    tempoRestante = tempoFoco * 60;

    // Resetar estados no localStorage
    salvarDado('pomodoro_esta_rodando', 'false');
    salvarDado('pomodoro_esta_pausado', 'false');
    salvarDado('pomodoro_modo_atual', 'foco');
    salvarDado('pomodoro_tempo_restante', tempoRestante);
    salvarDado('pomodoro_ultimo_timestamp', Date.now());

    atualizarInterface();
  }

  if (settingsForm) {
    settingsForm.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const novoTempoFoco = parseInt(inputFocusTime.value, 10);
      const novoTempoPausa = parseInt(inputBreakTime.value, 10);

      if (isNaN(novoTempoFoco) || novoTempoFoco < 1 || novoTempoFoco > 60) {
        mostrarNotificacao('Tempo de foco deve ser entre 1 e 60 minutos.', 'warning');
        return;
      }

      if (isNaN(novoTempoPausa) || novoTempoPausa < 1 || novoTempoPausa > 30) {
        mostrarNotificacao('Tempo de pausa deve ser entre 1 e 30 minutos.', 'warning');
        return;
      }

      tempoFoco = novoTempoFoco;
      tempoPausa = novoTempoPausa;
      salvarDado('pomodoro_focus_time', tempoFoco);
      salvarDado('pomodoro_break_time', tempoPausa);

      reiniciarTimer();
      mostrarNotificacao('Configurações salvas com sucesso!', 'success');
    });
  }

  if (btnStart) btnStart.addEventListener('click', iniciarTimer);
  if (btnPause) btnPause.addEventListener('click', pausarTimer);
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      reiniciarTimer();
      mostrarNotificacao('Timer reiniciado.', 'info');
    });
  }

  // Restaurar e recalcular o estado se o timer estava rodando antes de recarregar (F5)
  if (estaRodandoSalvo && ultimoTimestamp > 0) {
    const tempoDecorrido = Math.floor((Date.now() - ultimoTimestamp) / 1000);
    
    if (tempoDecorrido > 0) {
      let tempoParaProcessar = tempoDecorrido;
      while (tempoParaProcessar >= tempoRestante) {
        tempoParaProcessar -= tempoRestante;
        if (modoAtual === 'foco') {
          pomodorosConcluidos++;
          modoAtual = 'pausa';
          tempoRestante = tempoPausa * 60;
        } else {
          modoAtual = 'foco';
          tempoRestante = tempoFoco * 60;
        }
      }
      tempoRestante -= tempoParaProcessar;

      salvarDado('pomodoro_completed_count', pomodorosConcluidos);
      salvarDado('pomodoro_modo_atual', modoAtual);
      salvarDado('pomodoro_tempo_restante', tempoRestante);
    }

    iniciarTimer();
  } else {
    atualizarInterface();
  }
}

// Inicializa a aplicação garantindo que o DOM já esteja carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarTimerApp);
} else {
  inicializarTimerApp();
}
