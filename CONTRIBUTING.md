# 🚀 Guia de Desenvolvimento

## Estrutura Final do Projeto

```
roleta/
├── index.html                 # HTML limpo, apenas estrutura
├── README.md                  # Documentação principal
├── ARCHITECTURE.md            # Documentação da arquitetura
├── CONTRIBUTING.md            # Este arquivo
├── .gitignore                 # Arquivos ignorados pelo Git
│
└── src/                       # Código fonte organizado
    ├── styles/
    │   └── main.css          # Estilos customizados
    │
    └── scripts/
        ├── app.js            # Ponto de entrada (orquestrador)
        ├── audioManager.js   # Gerenciamento de áudio
        ├── storageManager.js # Persistência de dados
        ├── wheelManager.js   # Lógica da roleta
        └── uiManager.js      # Interface do usuário
```

## 🛠️ Ambiente de Desenvolvimento

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Editor de código (VS Code recomendado)
- Servidor HTTP local (opcional, mas recomendado)

### Servidor Local
Para testar com módulos ES6, você precisa de um servidor HTTP:

#### Opção 1: Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Opção 2: Node.js (http-server)
```bash
npx http-server -p 8000
```

#### Opção 3: VS Code Extension
- Instale "Live Server" extension
- Clique com botão direito em `index.html`
- Selecione "Open with Live Server"

### Acessar
Abra `http://localhost:8000` no navegador

## 📝 Padrões de Código

### JavaScript

#### Nomenclatura
```javascript
// Classes: PascalCase
class AudioManager {}

// Métodos/Funções: camelCase
playTick() {}

// Métodos privados: _camelCase
_drawSegment() {}

// Constantes: UPPER_SNAKE_CASE
const MAX_PARTICIPANTS = 100;

// Variáveis: camelCase
let isSpinning = false;
```

#### Estrutura de Classe
```javascript
/**
 * Descrição da classe
 */
export class MinhaClasse {
    constructor(dependencias) {
        // Inicialização
        this.dependencia = dependencias;
    }

    /**
     * Método público documentado
     * @param {tipo} parametro - Descrição
     * @returns {tipo} Descrição do retorno
     */
    metodoPublico(parametro) {
        // Implementação
    }

    /**
     * Método privado
     * @private
     */
    _metodoPrivado() {
        // Implementação interna
    }
}
```

### CSS

#### Organização
```css
/* 1. Variáveis */
:root {
    --cor-primaria: #22d3ee;
}

/* 2. Reset/Base */
body {
    font-family: 'Space Grotesk', sans-serif;
}

/* 3. Componentes */
.glass {
    background: rgba(15, 23, 42, 0.8);
}

/* 4. Animações */
@keyframes moveScanline {
    from { transform: translateY(0); }
    to { transform: translateY(100vh); }
}
```

## 🧪 Testando Alterações

### Checklist antes de commitar
- [ ] Código funciona sem erros no console
- [ ] Teste em diferentes navegadores
- [ ] Código está documentado (JSDoc)
- [ ] Formatação consistente
- [ ] Sem código comentado ou console.logs desnecessários
- [ ] Performance está adequada

### Cenários de Teste
1. **Adicionar participantes**
   - Um por vez
   - Múltiplos de uma vez
   - Lista com linhas vazias
   
2. **Girar roleta**
   - Com 1 participante
   - Com muitos participantes (10+)
   - Girando múltiplas vezes seguidas
   
3. **Persistência**
   - Recarregar página
   - Usar link compartilhado
   - Limpar localStorage
   
4. **Áudio**
   - Ligar/desligar durante giro
   - Testar em diferentes navegadores

## 🐛 Debugging

### Console do Navegador
```javascript
// No código, adicione temporariamente:
console.log('Estado atual:', this.participants);
console.log('Rotação:', this.rotation);

// Para debug de performance:
console.time('draw');
this.draw(participants);
console.timeEnd('draw');
```

### DevTools
- **Elements**: Inspecionar DOM e estilos
- **Console**: Ver erros e logs
- **Network**: Ver carregamento de arquivos
- **Application**: Ver localStorage
- **Performance**: Analisar performance

## 📚 Exemplos de Customização

### Adicionar Nova Cor na Roleta

```javascript
// Em wheelManager.js, linha ~11
this.colors = [
    ['#0c4a6e', '#0ea5e9'], 
    ['#701a75', '#d946ef'], 
    ['#312e81', '#6366f1'], 
    ['#064e3b', '#10b981'], 
    ['#7c2d12', '#f97316'],
    ['#1e3a8a', '#3b82f6'], // Nova cor: azul
];
```

### Mudar Duração do Giro

```javascript
// Em wheelManager.js, método spin(), linha ~119
const duration = 7000; // Altere de 5000 para 7000ms (7 segundos)
```

### Adicionar Som Personalizado

```javascript
// Em audioManager.js, adicione novo método:
/**
 * Reproduz som de clique
 */
playClick() {
    if (!this.audioEnabled) return;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
}
```

### Adicionar Validação de Nomes

```javascript
// Em uiManager.js, método addParticipants():
addParticipants(rawValue) {
    if (!rawValue) return;

    const lines = rawValue.split('\n')
        .map(n => n.trim())
        .filter(n => n !== '')
        .filter(n => n.length >= 2)        // Novo: mínimo 2 caracteres
        .filter(n => n.length <= 20);      // Novo: máximo 20 caracteres

    // ... resto do código
}
```

## 🎨 Customizando Temas

### Alterar Cores do Tema

```css
/* Em src/styles/main.css */
:root {
    --neon-cyan: #22d3ee;      /* Altere para sua cor preferida */
    --neon-magenta: #f0abfc;   /* Altere para sua cor preferida */
}
```

### Mudar Fonte

```css
/* Em src/styles/main.css */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

body { 
    font-family: 'Orbitron', sans-serif; /* Nova fonte */
}
```

## 📦 Adicionando Novos Módulos

### Exemplo: Módulo de Estatísticas

1. **Criar arquivo** `src/scripts/statsManager.js`:

```javascript
/**
 * Gerenciador de Estatísticas
 */
export class StatsManager {
    constructor() {
        this.totalSpins = 0;
        this.winners = {};
    }

    /**
     * Registra um novo giro
     */
    recordSpin(winner) {
        this.totalSpins++;
        this.winners[winner] = (this.winners[winner] || 0) + 1;
    }

    /**
     * Retorna estatísticas
     */
    getStats() {
        return {
            total: this.totalSpins,
            winners: this.winners
        };
    }
}
```

2. **Importar em app.js**:

```javascript
import { StatsManager } from './statsManager.js';

// No construtor:
this.statsManager = new StatsManager();

// No callback de vitória:
this.statsManager.recordSpin(winner.name);
```

3. **Adicionar UI** (se necessário) no `index.html`:

```html
<div id="stats">
    <!-- Estatísticas aqui -->
</div>
```

## 🔍 Referências Úteis

### APIs Utilizadas
- [Canvas API](https://developer.mozilla.org/pt-BR/docs/Web/API/Canvas_API)
- [Web Audio API](https://developer.mozilla.org/pt-BR/docs/Web/API/Web_Audio_API)
- [LocalStorage API](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)
- [URL API](https://developer.mozilla.org/pt-BR/docs/Web/API/URL)

### Bibliotecas
- [TailwindCSS](https://tailwindcss.com/docs)
- [Canvas Confetti](https://github.com/catdad/canvas-confetti)

## 💡 Dicas

1. **Use comentários JSDoc**: Facilita entender o código
2. **Teste frequentemente**: Não acumule mudanças sem testar
3. **Commits pequenos**: Facilita encontrar bugs
4. **Console é seu amigo**: Use para debug
5. **Leia o ARCHITECTURE.md**: Entenda como tudo se conecta

## ❓ Precisa de Ajuda?

- Verifique os exemplos neste arquivo
- Consulte `ARCHITECTURE.md` para entender a estrutura
- Leia os comentários inline no código
- Use o console do navegador para debug

---

**Boa codificação! 🚀**
