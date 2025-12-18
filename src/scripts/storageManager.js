/**
 * Gerenciador de Armazenamento
 * Responsável por persistir dados no localStorage e na URL
 */
export class StorageManager {
    constructor() {
        this.storageKey = 'rode_roleta_v1';
    }

    /**
     * Salva a lista de participantes no localStorage e na URL
     * @param {Array} participants - Array de participantes
     */
    saveState(participants) {
        const namesString = participants.map(p => p.name).join(',');
        
        // Salva no localStorage
        localStorage.setItem(this.storageKey, namesString);
        
        // Atualiza a URL
        try {
            const url = new URL(window.location);
            if (participants.length > 0) {
                url.searchParams.set('lista', namesString);
            } else {
                url.searchParams.delete('lista');
            }
            if (window.location.protocol !== 'blob:' && window.history.replaceState) {
                window.history.replaceState({}, '', url);
            }
        } catch (e) {
            console.warn('Erro ao atualizar URL:', e);
        }
    }

    /**
     * Carrega a lista de participantes da URL ou localStorage
     * @returns {Array} Array de participantes
     */
    loadState() {
        // Primeiro tenta carregar da URL
        try {
            const params = new URLSearchParams(window.location.search);
            const namesFromUrl = params.get('lista');
            if (namesFromUrl) {
                return this._parseParticipants(namesFromUrl);
            }
        } catch (e) {
            console.warn('Erro ao carregar da URL:', e);
        }

        // Se não houver na URL, carrega do localStorage
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            return this._parseParticipants(stored);
        }

        return [];
    }

    /**
     * Converte string de nomes em array de participantes
     * @param {string} namesString - String com nomes separados por vírgula
     * @returns {Array} Array de participantes
     * @private
     */
    _parseParticipants(namesString) {
        return namesString.split(',')
            .map(name => ({
                id: Math.random().toString(36).substr(2, 9),
                name: name.trim()
            }))
            .filter(p => p.name !== '');
    }

    /**
     * Gera URL compartilhável com a lista atual
     * @param {Array} participants - Array de participantes
     * @returns {string} URL compartilhável
     */
    generateShareUrl(participants) {
        const namesString = participants.map(p => p.name).join(',');
        return `${window.location.origin}${window.location.pathname}?lista=${encodeURIComponent(namesString)}`;
    }
}
