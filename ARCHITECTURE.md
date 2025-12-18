# 📐 Arquitetura Frontend - Roleta Arcade

## Visão Geral

Este documento descreve a arquitetura limpa implementada no projeto Roleta Arcade, seguindo princípios de **separação de responsabilidades**, **modularização** e **clean code**.

## Princípios Arquiteturais

### 1. **Separação de Responsabilidades (SRP)**
Cada módulo tem uma única responsabilidade bem definida:
- **AudioManager**: Apenas áudio
- **StorageManager**: Apenas persistência
- **WheelManager**: Apenas lógica da roleta
- **UIManager**: Apenas interface
- **App**: Apenas orquestração

### 2. **Modularização (ES6 Modules)**
- Uso de `import`/`export` para isolar código
- Cada módulo é independente e testável
- Dependências explícitas e controláveis

### 3. **Encapsulamento (Classes)**
- Uso de classes ES6 para agrupar lógica relacionada
- Métodos privados (prefixo `_`) para implementação interna
- API pública clara e documentada

### 4. **Injeção de Dependências**
- Módulos recebem suas dependências via construtor
- Exemplo: `WheelManager` recebe `AudioManager`
- Facilita testes e manutenção

## Fluxo de Dados

```
┌─────────────────┐
│   index.html    │  ← Estrutura HTML + CDNs
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    app.js       │  ← Inicializa e orquestra tudo
└────────┬────────┘
         │
         ├──────────────────────────────┐
         │                              │
         ▼                              ▼
┌──────────────────┐          ┌─────────────────┐
│  StorageManager  │◄─────────┤   UIManager     │
└──────────────────┘          └────────┬────────┘
                                       │
         ┌─────────────────────────────┤
         │                             │
         ▼                             ▼
┌──────────────────┐          ┌─────────────────┐
│  AudioManager    │◄─────────┤  WheelManager   │
└──────────────────┘          └─────────────────┘
```

## Camadas da Aplicação

### 📱 Camada de Apresentação
**Arquivo**: `index.html`
- Estrutura HTML limpa e semântica
- Referências a estilos e scripts externos
- Sem lógica de negócio embutida

### 🎨 Camada de Estilo
**Arquivo**: `src/styles/main.css`
- Estilos customizados
- Variáveis CSS para temas
- Animações e transições

### 🧠 Camada de Lógica

#### App (Orquestrador)
```javascript
// app.js - Ponto de entrada
new RoletaApp()
  ├── AudioManager
  ├── StorageManager
  ├── UIManager
  ├── WheelManager
  ├── AbortController (event listeners)
  └── Lifecycle (init/destroy)
```

#### Módulos Especializados

##### 🔊 AudioManager
**Responsabilidades:**
- Criar contexto de áudio Web Audio API
- Gerar sons proceduralmente (ticks, vitória)
- Controlar estado de habilitação
- Gerenciar estado suspenso (autoplay policy)
- Logging para debug

**Métodos Públicos:**
- `playTick()`: Som ao passar por segmento (async)
- `playWinSound()`: Som de vitória (async)
- `toggleAudio()`: Liga/desliga áudio
- `isEnabled()`: Verifica estado

**Métodos Privados:**
- `_initAudioContext()`: Inicializa contexto
- `_ensureAudioContext()`: Garante contexto ativo (async)

##### 💾 StorageManager
**Responsabilidades:**
- Salvar/carregar do localStorage
- Sincronizar com URL parameters
- Gerar links compartilháveis

**Métodos Públicos:**
- `saveState(participants)`: Persiste dados
- `loadState()`: Carrega dados
- `generateShareUrl(participants)`: Cria link compartilhável

##### 🎡 WheelManager
**Responsabilidades:**
- Desenhar roleta no canvas
- Animar rotação com easing
- Calcular vencedor
- Integrar com áudio

**Métodos Públicos:**
- `draw(participants)`: Renderiza roleta
- `spin(participants, onFinish)`: Inicia animação
- `getIsSpinning()`: Retorna estado

**Métodos Privados:**
- `_drawEmptyWheel()`: Desenha estado vazio
- `_drawSegment()`: Desenha um segmento
- `_drawBorder()`: Desenha borda
- `_finishSpin()`: Finaliza e calcula vencedor

##### 🖼️ UIManager
**Responsabilidades:**
- Manipular DOM
- Renderizar lista de participantes
- Controlar modais
- Gerenciar estados visuais

**Métodos Públicos:**
- `loadParticipants()`: Carrega da storage
- `addParticipants(text)`: Adiciona novos
- `removeParticipant(id)`: Remove um
- `render()`: Renderiza lista
- `updateSpinButton(state)`: Atualiza botão
- `showWinner(name)`: Mostra modal
- `closeModal()`: Fecha modal
- `updateAudioButton(state)`: Atualiza botão áudio
- `copyShareLink()`: Copia link
- `getParticipants()`: Retorna lista
- `clearInput()`: Limpa campo

## Fluxo de Eventos

### 1. Inicialização
```
DOMContentLoaded
    → new RoletaApp()
        → Cria todos os managers
        → loadParticipants()
        → draw()
        → setupEventListeners()
```

### 2. Adicionar Participante
```
User digita nome + Enter
    → nameForm.submit event
        → uiManager.addParticipants()
            → storageManager.saveState()
            → uiManager.render()
            → wheelManager.draw()
```

### 3. Girar Roleta
```
User clica "INICIAR SORTEIO"
    → spinBtn.click event
        → wheelManager.spin()
            → Animação (requestAnimationFrame)
            → audioManager.playTick() (a cada segmento)
            → Callback onFinish
                → audioManager.playWinSound()
                → uiManager.showWinner()
```

### 4. Remover Participante
```
User clica X no participante
    → window.removeParticipant(id)
        → uiManager.removeParticipant()
            → storageManager.saveState()
            → uiManager.render()
            → wheelManager.draw()
```

## Padrões de Design Utilizados

### 1. **Module Pattern**
- Cada arquivo é um módulo ES6
- Exports apenas o necessário

### 2. **Dependency Injection**
- Dependências passadas via construtor
- Facilita testes e mocking

### 3. **Observer Pattern**
- Event listeners para comunicação
- Callbacks para notificações

### 4. **Single Responsibility**
- Cada classe tem um propósito único
- Facilita manutenção e testes

### 5. **Factory Pattern** (implícito)
- App.js cria instâncias dos managers
- Centraliza criação de objetos

## Boas Práticas Implementadas

### ✅ Código Limpo
- Nomes descritivos e significativos
- Funções pequenas e focadas
- Comentários JSDoc em métodos públicos
- Separação de métodos privados (prefixo `_`)
- Error handling com try-catch
- Logs de debug informativos

### ✅ Manutenibilidade
- Estrutura de pastas organizada
- Separação de responsabilidades
- Baixo acoplamento entre módulos
- Alta coesão dentro dos módulos
- AbortController para gerenciar event listeners
- Método destroy() para cleanup

### ✅ Escalabilidade
- Fácil adicionar novos managers
- Fácil adicionar novos eventos
- Fácil modificar comportamentos isolados
- Vite para build e desenvolvimento rápido
- HMR (Hot Module Replacement) configurado

### ✅ Testabilidade
- Módulos isolados e independentes
- Dependências injetáveis
- Métodos públicos bem definidos
- Event listeners gerenciados centralmente

### ✅ Performance e Memory Management
- AbortController previne memory leaks
- Cleanup adequado de event listeners
- Lifecycle management (init/destroy)
- Remoção de variáveis globais no destroy

## Como Adicionar Novas Funcionalidades

### Exemplo: Adicionar Histórico de Vencedores

1. **Criar novo módulo** `historyManager.js`:
```javascript
export class HistoryManager {
    constructor(storageManager) {
        this.storage = storageManager;
        this.history = [];
    }
    
    addWinner(name) {
        this.history.push({ name, date: new Date() });
        this.save();
    }
    
    getHistory() {
        return this.history;
    }
}
```

2. **Integrar no App.js**:
```javascript
this.historyManager = new HistoryManager(this.storageManager);
```

3. **Usar no callback de vitória**:
```javascript
this.wheelManager.spin(participants, (winner) => {
    this.historyManager.addWinner(winner.name);
    this.uiManager.showWinner(winner.name);
});
```

## Diagrama de Dependências

```
app.js (Main)
  │
  ├─► AudioManager (independente)
  │
  ├─► StorageManager (independente)
  │
  ├─► UIManager ──► StorageManager
  │
  └─► WheelManager ──► AudioManager
```

## Gerenciamento de Recursos e Memory Safety

### AbortController Pattern

Todos os event listeners são registrados com um `AbortController`:

```javascript
this.abortController = new AbortController();
this.signal = this.abortController.signal;

element.addEventListener('click', handler, { signal: this.signal });
```

**Benefícios:**
- Cleanup automático com `abort()`
- Previne memory leaks
- Código mais limpo e seguro

### Lifecycle Management

```javascript
constructor() {
    // Inicialização
    this._setupEventListeners();
    this._initialize();
}

destroy() {
    // Cleanup
    this.abortController.abort();
    delete window.app;
    delete window.closeModal;
}
```

### Hot Module Replacement (HMR)

```javascript
// Cleanup durante HMR do Vite
if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        window.app.destroy();
    });
}
```

### Event Cleanup

```javascript
// Antes de sair da página
window.addEventListener('beforeunload', () => {
    window.app.destroy();
});
```

## Conclusão

Esta arquitetura proporciona:
- **Clareza**: Fácil entender o que cada parte faz
- **Manutenção**: Fácil corrigir bugs e adicionar features
- **Escalabilidade**: Fácil crescer o projeto
- **Testabilidade**: Fácil testar cada módulo isoladamente
- **Segurança**: Memory-safe com proper cleanup
- **Performance**: HMR e lifecycle otimizado

Para dúvidas ou sugestões, consulte a documentação inline (comentários JSDoc) em cada arquivo.
