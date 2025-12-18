/**
 * Gerenciador de Áudio Arcade
 * Responsável por toda a lógica de som da aplicação
 */
export class AudioManager {
    constructor() {
        this.audioEnabled = true;
        this.audioCtx = null;
        this._initAudioContext();
    }

    /**
     * Inicializa o contexto de áudio
     * @private
     */
    _initAudioContext() {
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🔊 AudioContext criado:', this.audioCtx.state);
        } catch (e) {
            console.warn('❌ Web Audio API não suportada:', e);
        }
    }

    /**
     * Garante que o contexto de áudio está ativo
     * @private
     */
    async _ensureAudioContext() {
        if (!this.audioCtx) {
            console.warn('❌ AudioContext não existe');
            return false;
        }
        
        if (this.audioCtx.state === 'suspended') {
            try {
                console.log('⏯️ Retomando AudioContext...');
                await this.audioCtx.resume();
                console.log('✅ AudioContext retomado:', this.audioCtx.state);
            } catch (e) {
                console.warn('❌ Erro ao retomar contexto de áudio:', e);
                return false;
            }
        }
        return true;
    }

    /**
     * Reproduz o som de tick ao passar por cada segmento da roleta
     */
    async playTick() {
        if (!this.audioEnabled) {
            console.log('🔇 Áudio desabilitado');
            return;
        }
        if (!await this._ensureAudioContext()) return;
        
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, this.audioCtx.currentTime); 
            osc.frequency.exponentialRampToValueAtTime(110, this.audioCtx.currentTime + 0.05);
            
            gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05);
            
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.05);
        } catch (e) {
            console.warn('❌ Erro ao reproduzir tick:', e);
        }
    }

    /**
     * Reproduz o som de vitória quando um vencedor é selecionado
     */
    async playWinSound() {
        if (!this.audioEnabled) return;
        if (!await this._ensureAudioContext()) return;
        
        try {
            const now = this.audioCtx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50];
            
            notes.forEach((f, i) => {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                
                osc.type = 'square';
                osc.frequency.setValueAtTime(f, now + (i * 0.1));
                
                gain.gain.setValueAtTime(0.1, now + (i * 0.1));
                gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.1) + 0.3);
                
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start(now + (i * 0.1));
                osc.stop(now + (i * 0.1) + 0.4);
            });
            console.log('🎉 Som de vitória reproduzido');
        } catch (e) {
            console.warn('❌ Erro ao reproduzir som de vitória:', e);
        }
    }

    /**
     * Alterna o estado do áudio entre ligado e desligado
     * @returns {boolean} Novo estado do áudio
     */
    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        return this.audioEnabled;
    }

    /**
     * Retorna o estado atual do áudio
     * @returns {boolean} Estado do áudio
     */
    isEnabled() {
        return this.audioEnabled;
    }
}
