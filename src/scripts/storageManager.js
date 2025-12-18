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
        try {
            localStorage.setItem(this.storageKey, namesString);
            console.log('💾 Salvo no localStorage:', namesString);
        } catch (e) {
            console.error('Erro ao salvar no localStorage:', e);
        }
        
        // Atualiza a URL de forma segura
        try {
            if (!window.history || !window.history.replaceState) {
                console.warn('History API não disponível');
                return;
            }

            const currentUrl = window.location.href;
            const url = new URL(currentUrl);
            
            if (participants.length > 0) {
                url.searchParams.set('lista', namesString);
            } else {
                url.searchParams.delete('lista');
            }
            
            const newUrl = url.toString();
            
            // Só atualiza se a URL for diferente
            if (currentUrl !== newUrl) {
                window.history.replaceState({}, '', newUrl);
                console.log('🔗 URL atualizada:', newUrl);
            }
        } catch (e) {
            console.warn('Não foi possível atualizar URL:', e);
            // Não é erro crítico, a aplicação continua funcionando
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
