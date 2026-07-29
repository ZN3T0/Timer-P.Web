import { css } from 'lit';

// Ficam no Shadow DOM do componente: não vazam para o resto da página
export const estilos = css`

  /* === ESTILOS GERAIS === */

  :host {
    display: block;
    font-family: Arial, sans-serif;
    color: #333;
    background-color: #f0f0f0;
    padding: 20px;
    min-height: 100vh;
  }

  /* === CONTAINER PRINCIPAL === */

  .pomodoro-app {
    max-width: 400px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
  }

  /* === CABEÇALHO === */

  .pomodoro-header {
    text-align: center;
    margin-bottom: 20px;
  }

  .pomodoro-header__title {
    font-size: 28px;
    color: #c0392b;
    margin: 0;
  }

  .pomodoro-header__subtitle {
    font-size: 14px;
    color: #777;
    margin: 4px 0 0 0;
  }

  /* === CARD DO TIMER === */

  .timer-card {
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 20px;
    margin-bottom: 16px;
    background-color: #fafafa;
  }

  .mode-badge {
    display: inline-block;
    background-color: #e74c3c;
    color: #fff;
    font-size: 13px;
    font-weight: bold;
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .mode-badge--break {
    background-color: #3498db;
  }

  .timer-display {
    display: block;
    font-size: 72px;
    font-weight: bold;
    color: #c0392b;
    letter-spacing: 2px;
    margin: 16px 0;
  }

  .timer__controls {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  /* === ESTILO DOS BOTÕES === */

  .btn {
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    padding: 8px 18px;
    border-radius: 4px;
    border: 1px solid #aaa;
    background-color: #eee;
    color: #333;
    cursor: pointer;
  }

  .btn:hover {
    background-color: #ddd;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn--start {
    background-color: #e74c3c;
    color: #fff;
    border-color: #c0392b;
  }

  .btn--start:hover:not(:disabled) {
    background-color: #c0392b;
  }

  .btn--pause {
    background-color: #3498db;
    color: #fff;
    border-color: #2980b9;
  }

  .btn--pause:hover:not(:disabled) {
    background-color: #2980b9;
  }

  .btn--reset {
    background-color: #eee;
    color: #555;
  }

  /* === CONTADOR DE POMODOROS === */

  .pomodoro-counter {
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 16px;
    background-color: #fafafa;
  }

  .pomodoro-counter__label {
    font-size: 15px;
    color: #555;
    margin: 0;
  }

  .pomodoro-counter__value {
    color: #c0392b;
    font-size: 18px;
  }

  .pomodoro-counter__dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .pomodoro-counter__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #c0392b;
    background-color: transparent;
  }

  .pomodoro-counter__dot--filled {
    background-color: #c0392b;
  }

  /* === CONFIGURAÇÕES === */

  .settings-card {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 16px;
    margin-bottom: 16px;
    background-color: #fafafa;
  }

  .settings-card__title {
    font-size: 14px;
    font-weight: bold;
    color: #777;
    text-transform: uppercase;
    margin: 0 0 12px 0;
  }

  .settings-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .form-row {
    display: flex;
    gap: 12px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .form-group__label {
    font-size: 13px;
    color: #555;
  }

  .form-group__input {
    font-family: Arial, sans-serif;
    font-size: 15px;
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
  }

  .form-group__input:focus {
    outline: none;
    border-color: #e74c3c;
  }

  .form-group__suffix {
    font-size: 11px;
    color: #999;
  }

  .btn--save {
    background-color: #27ae60;
    color: #fff;
    border-color: #1e8449;
    width: 100%;
    padding: 8px;
  }

  .btn--save:hover {
    background-color: #1e8449;
  }

  /* === ÁREA DE NOTIFICAÇÕES === */

  .notifications-area {
    border: 1px dashed #bbb;
    border-radius: 6px;
    padding: 12px;
    min-height: 50px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .notifications-area__placeholder {
    font-size: 13px;
    color: #aaa;
    font-style: italic;
    margin: 0;
  }

  .notification {
    font-size: 13px;
    padding: 6px 12px;
    border-radius: 4px;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
  }

  .notification--success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .notification--info {
    background-color: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }

  .notification--warning {
    background-color: #fff3cd;
    color: #856404;
    border: 1px solid #ffeeba;
  }

  /* === RODAPÉ === */

  .pomodoro-footer {
    text-align: center;
  }

  .pomodoro-footer__text {
    font-size: 11px;
    color: #bbb;
    margin: 0;
  }

  /* === RESPONSIVIDADE === */

  @media (max-width: 440px) {
    .timer-display {
      font-size: 56px;
    }

    .form-row {
      flex-direction: column;
    }

    .timer__controls {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 80%;
    }
  }
`;
