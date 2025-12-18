/**
 * Gerenciador de Interface
 * Responsável por manipular a UI e eventos DOM
 */
export class UIManager {
    constructor(storageManager) {
        this.storageManager = storageManager;
        this.participants = [];
        this._initializeElements();
    }

    /**
     * Inicializa referências aos elementos DOM
     * @private
     */
    _initializeElements() {
        this.nameList = document.getElementById('nameList');
        this.nameInput = document.getElementById('nameInput');
        this.nameForm = document.getElementById('nameForm');
        this.spinBtn = document.getElementById('spinBtn');
        this.statusMsg = document.getElementById('statusMsg');
        this.copyBtn = document.getElementById('copyBtn');
        this.audioToggleBtn = document.getElementById('toggleAudio');
        this.audioStatusText = document.getElementById('audioStatus');
        this.audioIcon = document.getElementById('audioIcon');
        this.winnerModal = document.getElementById('winnerModal');
        this.winnerNameDiv = document.getElementById('winnerName');
    }

    /**
     * Carrega os participantes do armazenamento
     */
    loadParticipants() {
        this.participants = this.storageManager.loadState();
        this.render();
    }

    /**
     * Adiciona novos participantes
     * @param {string} rawValue - Texto com nomes (um por linha)
     */
    addParticipants(rawValue) {
        if (!rawValue) return;

        const lines = rawValue.split('\n')
            .map(n => n.trim())
            .filter(n => n !== '');

        if (lines.length === 0) return;

        lines.forEach(name => {
            this.participants.push({ 
                id: Math.random().toString(36).substr(2, 9), 
                name: name 
            });
        });

        this.storageManager.saveState(this.participants);
        this.render();
    }

    /**
     * Remove um participante
     * @param {string} id - ID do participante
     */
    removeParticipant(id) {
        this.participants = this.participants.filter(p => p.id !== id);
        this.storageManager.saveState(this.participants);
        this.render();
    }

    /**
     * Renderiza a lista de participantes
     */
    render() {
        if (this.participants.length === 0) {
            this._renderEmptyState();
            this.spinBtn.disabled = true;
            return;
        }

        this.spinBtn.disabled = false;
        this.nameList.innerHTML = this.participants.map(p => `
            <div class="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800 hover:border-cyan-400/50 transition-all group">
                <span class="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate pr-4 text-lg mono uppercase tracking-tighter">${p.name}</span>
                <button onclick="window.app.removeParticipant('${p.id}')" class="text-slate-500 hover:text-red-400 p-2 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    /**
     * Renderiza estado vazio
     * @private
     */
    _renderEmptyState() {
        this.nameList.innerHTML = `
            <div class="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-800 rounded-2xl opacity-50">
                <div class="text-sm text-slate-500 uppercase tracking-widest mono text-center px-4">
                    A aguardar entrada de dados...
                </div>
            </div>
        `;
    }

    /**
     * Atualiza o estado do botão de spin
     * @param {boolean} isSpinning - Se está girando
     */
    updateSpinButton(isSpinning) {
        if (isSpinning) {
            this.spinBtn.disabled = true;
            this.spinBtn.innerText = "A PROCESSAR...";
        } else {
            this.spinBtn.disabled = false;
            this.spinBtn.innerText = "INICIAR SORTEIO";
        }
    }

    /**
     * Mostra o modal do vencedor
     * @param {string} name - Nome do vencedor
     */
    showWinner(name) {
        this.winnerNameDiv.innerText = name;
        this.winnerModal.classList.remove('hidden');
        
        // Confetti
        confetti({ 
            particleCount: 250, 
            spread: 120, 
            origin: { y: 0.6 }, 
            colors: ['#22d3ee', '#f472b6', '#ffffff'] 
        });
    }

    /**
     * Fecha o modal do vencedor
     */
    closeModal() {
        this.winnerModal.classList.add('hidden');
    }

    /**
     * Atualiza o estado visual do botão de áudio
     * @param {boolean} isEnabled - Se o áudio está habilitado
     */
    updateAudioButton(isEnabled) {
        this.audioStatusText.innerText = isEnabled ? "ÁUDIO ARCADE ON" : "ÁUDIO ARCADE OFF";
        this.audioIcon.innerText = isEnabled ? "🔊" : "🔇";
        
        if (isEnabled) {
            this.audioToggleBtn.classList.remove('border-red-500/30', 'text-red-400');
            this.audioToggleBtn.classList.add('border-cyan-400/30', 'text-cyan-400');
        } else {
            this.audioToggleBtn.classList.remove('border-cyan-400/30', 'text-cyan-400');
            this.audioToggleBtn.classList.add('border-red-500/30', 'text-red-400');
        }
    }

    /**
     * Copia o link compartilhável para a área de transferência
     */
    copyShareLink() {
        try {
            const shareUrl = this.storageManager.generateShareUrl(this.participants);
            const dummy = document.createElement('input');
            document.body.appendChild(dummy);
            dummy.value = shareUrl;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);

            const originalText = this.copyBtn.innerHTML;
            this.copyBtn.innerHTML = 'LINK COPIADO!';
            setTimeout(() => this.copyBtn.innerHTML = originalText, 2000);
        } catch (err) {
            console.error('Erro ao copiar link:', err);
        }
    }

    /**
     * Retorna a lista atual de participantes
     * @returns {Array} Array de participantes
     */
    getParticipants() {
        return this.participants;
    }

    /**
     * Limpa o campo de entrada
     */
    clearInput() {
        this.nameInput.value = '';
    }
}
