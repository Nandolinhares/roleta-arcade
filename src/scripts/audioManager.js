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
     * Som estilo arcade/fliperama - tick mecânico
     */
    async playTick() {
        if (!this.audioEnabled) {
            console.log('🔇 Áudio desabilitado');
            return;
        }
        if (!await this._ensureAudioContext()) return;
        
        try {
            const now = this.audioCtx.currentTime;
            
            // Oscilador principal - som metálico agudo
            const osc1 = this.audioCtx.createOscillator();
            const gain1 = this.audioCtx.createGain();
            
            osc1.type = 'square';
            osc1.frequency.setValueAtTime(1200, now);
            osc1.frequency.exponentialRampToValueAtTime(400, now + 0.02);
            
            gain1.gain.setValueAtTime(0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
            
            // Oscilador secundário - adiciona corpo ao som
            const osc2 = this.audioCtx.createOscillator();
            const gain2 = this.audioCtx.createGain();
            
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(150, now);
            osc2.frequency.exponentialRampToValueAtTime(50, now + 0.03);
            
            gain2.gain.setValueAtTime(0.2, now);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
            
            // Noise burst - adiciona textura de clique mecânico
            const bufferSize = this.audioCtx.sampleRate * 0.02;
            const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
            const noiseData = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
            }
            
            const noise = this.audioCtx.createBufferSource();
            noise.buffer = noiseBuffer;
            const noiseGain = this.audioCtx.createGain();
            noiseGain.gain.setValueAtTime(0.15, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
            
            // Conecta tudo
            osc1.connect(gain1);
            osc2.connect(gain2);
            noise.connect(noiseGain);
            
            gain1.connect(this.audioCtx.destination);
            gain2.connect(this.audioCtx.destination);
            noiseGain.connect(this.audioCtx.destination);
            
            // Inicia e para
            osc1.start(now);
            osc1.stop(now + 0.02);
            osc2.start(now);
            osc2.stop(now + 0.03);
            noise.start(now);
        } catch (e) {
            console.warn('❌ Erro ao reproduzir tick:', e);
        }
    }

    /**
     * Reproduz o som de vitória quando um vencedor é selecionado
     * Som estilo arcade - melodia triunfante de 8-bit
     */
    async playWinSound() {
        if (!this.audioEnabled) return;
        if (!await this._ensureAudioContext()) return;
        
        try {
            const now = this.audioCtx.currentTime;
            
            // Melodia de vitória estilo arcade (C-E-G-C mais alto)
            const melody = [
                { freq: 523.25, time: 0.0 },   // C5
                { freq: 659.25, time: 0.12 },  // E5
                { freq: 783.99, time: 0.24 },  // G5
                { freq: 1046.50, time: 0.36 }, // C6
                { freq: 1046.50, time: 0.48 }, // C6 (repete)
            ];
            
            melody.forEach(({ freq, time }) => {
                // Oscilador principal - onda quadrada arcade
                const osc1 = this.audioCtx.createOscillator();
                const gain1 = this.audioCtx.createGain();
                
                osc1.type = 'square';
                osc1.frequency.setValueAtTime(freq, now + time);
                
                gain1.gain.setValueAtTime(0.15, now + time);
                gain1.gain.exponentialRampToValueAtTime(0.01, now + time + 0.25);
                
                // Oscilador harmônico - adiciona profundidade
                const osc2 = this.audioCtx.createOscillator();
                const gain2 = this.audioCtx.createGain();
                
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(freq * 2, now + time);
                
                gain2.gain.setValueAtTime(0.05, now + time);
                gain2.gain.exponentialRampToValueAtTime(0.01, now + time + 0.25);
                
                osc1.connect(gain1);
                osc2.connect(gain2);
                gain1.connect(this.audioCtx.destination);
                gain2.connect(this.audioCtx.destination);
                
                osc1.start(now + time);
                osc1.stop(now + time + 0.3);
                osc2.start(now + time);
                osc2.stop(now + time + 0.3);
            });
            
            // Efeito de "brilho" no final (sweep ascendente)
            const sweep = this.audioCtx.createOscillator();
            const sweepGain = this.audioCtx.createGain();
            
            sweep.type = 'sine';
            sweep.frequency.setValueAtTime(1046.50, now + 0.6);
            sweep.frequency.exponentialRampToValueAtTime(2093, now + 0.85);
            
            sweepGain.gain.setValueAtTime(0.2, now + 0.6);
            sweepGain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);
            
            sweep.connect(sweepGain);
            sweepGain.connect(this.audioCtx.destination);
            sweep.start(now + 0.6);
            sweep.stop(now + 0.85);
            
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
