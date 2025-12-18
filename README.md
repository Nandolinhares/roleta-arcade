# 🎰 Roleta Arcade - Sorteador

Uma aplicação web moderna de sorteio em estilo arcade com roleta giratória, efeitos sonoros e visuais impressionantes.

## 📁 Estrutura do Projeto

```
roleta/
├── index.html                      # Arquivo HTML principal (limpo e organizado)
├── README.md                       # Documentação do projeto
└── src/                           # Código fonte
    ├── styles/                    # Estilos CSS
    │   └── main.css              # Estilos customizados da aplicação
    └── scripts/                   # JavaScript modular
        ├── app.js                # Arquivo principal que orquestra a aplicação
        ├── audioManager.js       # Gerenciamento de áudio e efeitos sonoros
        ├── storageManager.js     # Persistência de dados (localStorage e URL)
        ├── wheelManager.js       # Lógica da roleta (desenho e animação)
        └── uiManager.js          # Gerenciamento da interface do usuário
```

## 🏗️ Arquitetura

A aplicação segue uma **arquitetura frontend limpa e modular** com separação clara de responsabilidades:

### 📦 Módulos

#### 1. **AudioManager** (`audioManager.js`)
- Gerencia todo o sistema de áudio da aplicação
- Web Audio API com síntese de som procedural
- Efeitos sonoros: ticks e som de vitória
- Controle de habilitação/desabilitação de áudio
- Tratamento de estado suspenso (autoplay policy)
- Logs de debug para troubleshooting

#### 2. **StorageManager** (`storageManager.js`)
- Persistência de dados no `localStorage`
- Sincronização de dados com parâmetros da URL
- Geração de links compartilháveis
- Parsing seguro de dados

#### 3. **WheelManager** (`wheelManager.js`)
- Desenho da roleta no canvas HTML5
- Animações de rotação com easing cubic
- Cálculo matemático do vencedor
- Integração com sistema de áudio (ticks durante rotação)
- Suporte a múltiplas cores e gradientes

#### 4. **UIManager** (`uiManager.js`)
- Manipulação de elementos DOM
- Renderização dinâmica da lista de participantes
- Controle de modais
- Feedback visual para o usuário
- Gerenciamento de estados de botões

#### 5. **App** (`app.js`)
- Ponto de entrada da aplicação
- Orquestração de todos os módulos
- Configuração de event listeners com AbortController
- Inicialização do sistema
- Hot Module Replacement (HMR) do Vite
- Lifecycle management (destroy/cleanup)

## 🎨 Características

- ✨ **Design Arcade**: Visual retrô-futurista com efeitos neon
- 🎵 **Áudio Dinâmico**: Sons sintetizados em tempo real com Web Audio API
- 💾 **Persistência**: Dados salvos automaticamente (localStorage + URL)
- 🔗 **Compartilhamento**: Links diretos com listas pré-carregadas
- 📱 **Responsivo**: Interface adaptável a diferentes dispositivos
- 🎯 **Modular**: Código organizado com ES6 Modules
- ⚡ **Vite**: Build tool moderno com HMR
- 🧹 **Memory Safe**: AbortController para cleanup de event listeners
- 🔊 **Debug Friendly**: Logs detalhados para troubleshooting

## 🚀 Como Usar

### Desenvolvimento (com Vite)

1. **Instalar dependências**:
   ```bash
   yarn install
   ```

2. **Iniciar servidor de desenvolvimento**:
   ```bash
   yarn dev
   ```
   O navegador abrirá automaticamente em `http://localhost:3000`

3. **Build para produção**:
   ```bash
   yarn build
   ```
   Os arquivos otimizados estarão em `dist/`

4. **Visualizar build de produção**:
   ```bash
   yarn preview
   ```

### Usando a Aplicação

1. Adicione participantes (um por linha) no campo de texto
2. Clique em "INICIAR SORTEIO" para girar a roleta
3. Use o botão de áudio para ativar/desativar sons
4. Compartilhe sua lista através do botão "PARTILHAR LISTA ATUAL"

## 🛠️ Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Animações e efeitos visuais com custom properties
- **JavaScript ES6+**: Modules, Classes, Arrow Functions, Async/Await
- **Canvas API**: Desenho e animação da roleta
- **Web Audio API**: Síntese de áudio procedural em tempo real
- **Vite**: Build tool e dev server com HMR
- **Yarn**: Gerenciador de pacotes
- **TailwindCSS**: Framework CSS utility-first
- **Canvas Confetti**: Efeitos de confetti
- **AbortController**: Gerenciamento de event listeners

## 📝 Padrões de Código

- **ES6 Modules**: Import/Export para modularidade
- **Classes**: Encapsulamento orientado a objetos
- **Single Responsibility**: Cada módulo tem uma única responsabilidade
- **Dependency Injection**: Dependências passadas via construtor
- **AbortController**: Gerenciamento adequado de event listeners
- **Lifecycle Methods**: Constructor, initialize, destroy
- **Error Handling**: Try-catch com logs informativos
- **Async/Await**: Para operações assíncronas (AudioContext)
- **Comentários JSDoc**: Documentação inline do código
- **Nomenclatura Clara**: Funções e variáveis autoexplicativas
- **Private Methods**: Prefixo `_` para métodos internos

## 🔧 Manutenção

Para adicionar novas funcionalidades:

1. **Novos efeitos sonoros**: Edite `audioManager.js`
2. **Novos elementos visuais**: Edite `main.css` e `wheelManager.js`
3. **Nova lógica de negócio**: Crie novos módulos em `src/scripts/`
4. **Integração**: Importe e use no `app.js`
5. **Event listeners**: Use `{ signal: this.signal }` para cleanup automático
6. **Limpeza de recursos**: Adicione lógica no método `destroy()` se necessário

### Debug de Áudio

O AudioManager inclui logs detalhados. Abra o DevTools Console (F12) para ver:
- 🔊 AudioContext criado
- ⏯️ Retomando AudioContext
- ✅ AudioContext retomado
- 🔇 Áudio desabilitado
- 🎉 Som de vitória reproduzido
- ❌ Erros (se houver)

## 📄 Licença

Este projeto é open source e está disponível para uso livre.
