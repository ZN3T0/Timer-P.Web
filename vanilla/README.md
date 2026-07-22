# Timer Pomodoro

Um cronômetro Pomodoro minimalista e altamente responsivo para ajudar a gerenciar ciclos de foco e pausas. Desenvolvido puramente com HTML5, CSS3 e Vanilla JavaScript (sem frameworks ou dependências externas).

## 🚀 Como Executar o Projeto

Como o sistema é construído exclusivamente com tecnologias front-end estáticas (sem backend ou processamento no servidor), você pode executá-lo de duas formas:

### Opção 1: Abertura Direta (Rápido)
1. Dê um duplo clique no arquivo `vanilla/index.html` (ou clique com o botão direito e selecione para abrir em seu navegador preferido).

> [!NOTE]
> Devido às políticas de segurança de áudio dos navegadores modernos, o sinal sonoro de transição do timer (Web Audio API) só será reproduzido após a primeira interação física do usuário com a página (por exemplo, ao clicar em "Start").

### Opção 2: Servidor Local (Recomendado)
Para uma experiência mais realista de ambiente de produção, execute utilizando um servidor local HTTP:
* **VS Code (Live Server):** Instale a extensão "Live Server", clique com o botão direito em `vanilla/index.html` e selecione **"Open with Live Server"**.
* **Via Terminal/Node.js:**
  ```bash
  npx serve vanilla
  ```
  Abra o endereço gerado (geralmente `http://localhost:3000`) no navegador.

---
