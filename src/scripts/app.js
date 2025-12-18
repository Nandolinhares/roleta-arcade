/**
 * Aplicação Principal - Roleta Arcade
 * Orquestra todos os módulos da aplicação
 */
import { AudioManager } from './audioManager.js';
import { StorageManager } from './storageManager.js';
import { WheelManager } from './wheelManager.js';
import { UIManager } from './uiManager.js';

class RoletaApp {
    constructor() {
        this.audioManager = new AudioManager();
        this.storageManager = new StorageManager();
        this.uiManager = new UIManager(this.storageManager);
        
        const canvas = document.getElementById('wheel');
        this.wheelManager = new WheelManager(canvas, this.audioManager);
        
        // AbortController para gerenciar event listeners
        this.abortController = new AbortController();
        this.signal = this.abortController.signal;
        
        this._setupEventListeners();
        this._initialize();
    }

    /**
     * Inicializa a aplicação
     * @private
     */
    _initialize() {
        this.uiManager.loadParticipants();
        this.wheelManager.draw(this.uiManager.getParticipants());
        
        // Event listener com signal para poder ser removido
        window.addEventListener('resize', () => {
            this.wheelManager.draw(this.uiManager.getParticipants());
        }, { signal: this.signal });
    }

    /**
     * Ativa o AudioContext (necessário após interação do usuário)
     * @private
     */
    _activateAudio() {
        if (this.audioManager.audioCtx && this.audioManager.audioCtx.state === 'suspended') {
            this.audioManager.audioCtx.resume();
        }
    }

    /**
     * Configura os event listeners
     * @private
     */
    _setupEventListeners() {
        // Formulário de adicionar nomes
        this.uiManager.nameForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this._activateAudio();
            const rawValue = this.uiManager.nameInput.value;
            
            if (!rawValue || this.wheelManager.getIsSpinning()) return false;

            this.uiManager.addParticipants(rawValue);
            this.uiManager.clearInput();
            this.wheelManager.draw(this.uiManager.getParticipants());
            return false;
        }, { signal: this.signal });

        // Botão de girar
        this.uiManager.spinBtn.addEventListener('click', async () => {
            this._activateAudio();
            if (this.wheelManager.getIsSpinning() || this.uiManager.getParticipants().length === 0) {
                return;
            }

            this.uiManager.updateSpinButton(true);
            
            this.wheelManager.spin(
                this.uiManager.getParticipants(),
                (winner) => {
                    this.uiManager.showWinner(winner.name);
                    this.uiManager.updateSpinButton(false);
                }
            );
        }, { signal: this.signal });

        // Botão de toggle de áudio
        this.uiManager.audioToggleBtn.addEventListener('click', async () => {
            this._activateAudio();
            const newState = this.audioManager.toggleAudio();
            this.uiManager.updateAudioButton(newState);
        }, { signal: this.signal });

        // Botão de copiar link
        this.uiManager.copyBtn.addEventListener('click', () => {
            this.uiManager.copyShareLink();
        }, { signal: this.signal });

        // Expõe função de remover participante globalmente
        window.removeParticipant = (id) => {
            if (this.wheelManager.getIsSpinning()) return;
            this.uiManager.removeParticipant(id);
            this.wheelManager.draw(this.uiManager.getParticipants());
        };

        // Expõe função de fechar modal globalmente
        window.closeModal = () => {
            this.uiManager.closeModal();
        };
    }

    /**
     * Limpa todos os event listeners e recursos
     */
    destroy() {
        this.abortController.abort();
        delete window.app;
        delete window.removeParticipant;
        delete window.closeModal;
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Destroi instância anterior se existir (útil em HMR do Vite)
    if (window.app && typeof window.app.destroy === 'function') {
        window.app.destroy();
    }
    
    window.app = new RoletaApp();
    
    // Limpa recursos quando a página for descarregada
    window.addEventListener('beforeunload', () => {
        if (window.app && typeof window.app.destroy === 'function') {
            window.app.destroy();
        }
    });
});

// Hot Module Replacement (HMR) do Vite
if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        if (window.app && typeof window.app.destroy === 'function') {
            window.app.destroy();
        }
    });
}
