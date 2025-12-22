// Canvas для жидкостных эффектов
class LiquidCanvas {
    constructor() {
        this.canvas = document.getElementById('liquidCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.waves = [];
        this.mouse = { x: 0, y: 0, moved: false };
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth * window.innerHeight / 10000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.moved = true;
            
            // Создаем волну от движения мыши
            this.createMouseWave(e.clientX, e.clientY);
        });

        document.addEventListener('click', (e) => {
            this.createClickRipple(e.clientX, e.clientY);
        });
    }

    createMouseWave(x, y) {
        this.waves.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: 100,
            speed: 2,
            opacity: 0.3,
            life: 1
        });
    }

    createClickRipple(x, y) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.waves.push({
                    x: x,
                    y: y,
                    radius: 0,
                    maxRadius: 150 + i * 50,
                    speed: 3,
                    opacity: 0.2 - i * 0.05,
                    life: 1
                });
            }, i * 100);
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.updateWaves();
        this.drawParticles();
        this.drawWaves();
        
        requestAnimationFrame(() => this.animate());
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Движение частиц
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Отскок от границ
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
            
            // Взаимодействие с мышью
            if (this.mouse.moved) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.speedX += dx * 0.0005 * force;
                    particle.speedY += dy * 0.0005 * force;
                }
            }
            
            // Ограничение скорости
            const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
            if (speed > 2) {
                particle.speedX = (particle.speedX / speed) * 2;
                particle.speedY = (particle.speedY / speed) * 2;
            }
        });
        
        this.mouse.moved = false;
    }

    updateWaves() {
        for (let i = this.waves.length - 1; i >= 0; i--) {
            const wave = this.waves[i];
            wave.radius += wave.speed;
            wave.life = 1 - (wave.radius / wave.maxRadius);
            
            if (wave.radius > wave.maxRadius) {
                this.waves.splice(i, 1);
            }
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(144, 224, 239, ${particle.opacity})`;
            this.ctx.fill();
        });
    }

    drawWaves() {
        this.waves.forEach(wave => {
            this.ctx.beginPath();
            this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(0, 255, 234, ${wave.opacity * wave.life})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    new LiquidCanvas();
});
