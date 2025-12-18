/**
 * Gerenciador da Roleta
 * Responsável por desenhar e animar a roleta
 */
export class WheelManager {
    constructor(canvas, audioManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.audioManager = audioManager;
        this.rotation = 0;
        this.isSpinning = false;
        this.colors = [
            ['#0c4a6e', '#0ea5e9'], 
            ['#701a75', '#d946ef'], 
            ['#312e81', '#6366f1'], 
            ['#064e3b', '#10b981'], 
            ['#7c2d12', '#f97316']
        ];
    }

    /**
     * Desenha a roleta com os participantes atuais
     * @param {Array} participants - Array de participantes
     */
    draw(participants) {
        const size = 1000;
        this.canvas.width = size;
        this.canvas.height = size;

        if (participants.length === 0) {
            this._drawEmptyWheel(size);
            return;
        }

        const arcSize = (2 * Math.PI) / participants.length;

        participants.forEach((p, i) => {
            const angle = i * arcSize;
            const colorPair = this.colors[i % this.colors.length];
            
            this._drawSegment(size, angle, arcSize, colorPair, p.name);
        });

        this._drawBorder(size);
    }

    /**
     * Desenha uma roleta vazia
     * @param {number} size - Tamanho do canvas
     * @private
     */
    _drawEmptyWheel(size) {
        this.ctx.clearRect(0, 0, size, size);
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#1e293b';
        this.ctx.lineWidth = 10;
        this.ctx.arc(size/2, size/2, size/2 - 20, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    /**
     * Desenha um segmento da roleta
     * @param {number} size - Tamanho do canvas
     * @param {number} angle - Ângulo inicial do segmento
     * @param {number} arcSize - Tamanho do arco
     * @param {Array} colorPair - Par de cores [cor1, cor2]
     * @param {string} name - Nome do participante
     * @private
     */
    _drawSegment(size, angle, arcSize, colorPair, name) {
        // Gradiente radial
        const grad = this.ctx.createRadialGradient(size/2, size/2, 100, size/2, size/2, size/2);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, colorPair[0]);

        // Desenha o segmento
        this.ctx.beginPath();
        this.ctx.fillStyle = grad;
        this.ctx.strokeStyle = colorPair[1];
        this.ctx.lineWidth = 4;
        this.ctx.moveTo(size/2, size/2);
        this.ctx.arc(size/2, size/2, size/2 - 20, angle, angle + arcSize);
        this.ctx.lineTo(size/2, size/2);
        this.ctx.fill();
        this.ctx.stroke();

        // Desenha o texto
        this.ctx.save();
        this.ctx.translate(size/2, size/2);
        this.ctx.rotate(angle + arcSize / 2);
        this.ctx.textAlign = "right";
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = "rgba(0,0,0,1)";
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "bold 42px 'JetBrains Mono'";
        this.ctx.fillText(name.substring(0, 16).toUpperCase(), size/2 - 80, 15);
        this.ctx.restore();
    }

    /**
     * Desenha a borda externa da roleta
     * @param {number} size - Tamanho do canvas
     * @private
     */
    _drawBorder(size) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#22d3ee';
        this.ctx.lineWidth = 20;
        this.ctx.arc(size/2, size/2, size/2 - 10, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    /**
     * Inicia a animação de rotação da roleta
     * @param {Array} participants - Array de participantes
     * @param {Function} onFinish - Callback chamado ao terminar
     */
    spin(participants, onFinish) {
        if (this.isSpinning || participants.length === 0) return;

        this.isSpinning = true;
        const startRotation = this.rotation % 360;
        const extraSpins = 8 + Math.random() * 5;
        const totalRotation = extraSpins * 360 + Math.random() * 360;
        const duration = 5000;
        const startTime = performance.now();
        const arcSizeDeg = 360 / participants.length;
        
        let lastTickSegment = Math.floor((270 - startRotation + 360) % 360 / arcSizeDeg);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const currentMove = totalRotation * ease;
            const currentAbsRotation = startRotation + currentMove;
            
            this.rotation = currentAbsRotation;
            this.canvas.style.transform = `rotate(${this.rotation}deg)`;

            // Reproduz tick ao mudar de segmento
            const currentSegment = Math.floor((270 - this.rotation % 360 + 360) % 360 / arcSizeDeg);
            if (currentSegment !== lastTickSegment) {
                this.audioManager.playTick();
                lastTickSegment = currentSegment;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this._finishSpin(participants, onFinish);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Finaliza a rotação e determina o vencedor
     * @param {Array} participants - Array de participantes
     * @param {Function} onFinish - Callback chamado ao terminar
     * @private
     */
    _finishSpin(participants, onFinish) {
        const actualDegrees = this.rotation % 360;
        const normalizedRotation = (360 - actualDegrees + 270) % 360;
        const arcSizeDegrees = 360 / participants.length;
        const winnerIndex = Math.floor(normalizedRotation / arcSizeDegrees) % participants.length;
        
        this.isSpinning = false;
        this.audioManager.playWinSound();
        
        if (onFinish) {
            onFinish(participants[winnerIndex]);
        }
    }

    /**
     * Retorna se a roleta está girando
     * @returns {boolean} Estado de rotação
     */
    getIsSpinning() {
        return this.isSpinning;
    }
}
