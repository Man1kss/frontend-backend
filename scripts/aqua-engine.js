// Основной движок водных эффектов
class AquaEngine {
    constructor() {
        this.isInitialized = false;
        this.particles = [];
        this.waves = [];
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('🌊 Aqua Engine инициализирован');
        this.isInitialized = true;
        
        this.initWaterEffects();
        this.initInteractiveElements();
        this.initPerformanceOptimization();
    }

    initWaterEffects() {
        // Создание дополнительных пузырьков
        this.createBubbles();
        
        // Инициализация волн
        this.createWaves();
        
        // Запуск анимации
        this.startAnimation();
    }

    createBubbles() {
        const bubblesContainer = document.querySelector('.bubbles-container');
        if (!bubblesContainer) return;

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createBubble(bubblesContainer);
            }, i * 300);
        }
    }

    createBubble(container) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-particle';
        
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 20 + 15;
        
        bubble.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, 
                rgba(202, 240, 248, 0.8) 0%, 
                rgba(144, 224, 239, 0.4) 50%, 
                transparent 70%);
            border-radius: 50%;
            left: ${left}%;
            bottom: -20px;
            animation: bubbleFloat ${duration}s ease-in-out ${delay}s infinite;
            pointer-events: none;
        `;

        container.appendChild(bubble);
        
        // Добавляем стили анимации если их нет
        if (!document.querySelector('#bubble-animations')) {
            const style = document.createElement('style');
            style.id = 'bubble-animations';
            style.textContent = `
                @keyframes bubbleFloat {
                    0% {
                        transform: translateY(0) translateX(0) scale(0.5);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.7;
                        transform: translateY(-10vh) translateX(10px) scale(1);
                    }
                    90% {
                        opacity: 0.4;
                        transform: translateY(-80vh) translateX(20px) scale(0.8);
                    }
                    100% {
                        transform: translateY(-100vh) translateX(30px) scale(0.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createWaves() {
        // Дополнительные динамические волны
        const wavesContainer = document.querySelector('.waves-container');
        if (!wavesContainer) return;

        for (let i = 0; i < 2; i++) {
            const wave = document.createElement('div');
            wave.className = `dynamic-wave wave-${i + 4}`;
            
            const height = 30 + Math.random() * 20;
            const duration = 12 + Math.random() * 8;
            const delay = Math.random() * 5;
            
            wave.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                width: 200%;
                height: ${height}%;
                background: linear-gradient(90deg, 
                    transparent 0%, 
                    rgba(144, 224, 239, ${0.2 + Math.random() * 0.2}) 50%, 
                    transparent 100%);
                animation: waveMove ${duration}s linear ${delay}s infinite;
                opacity: ${0.1 + Math.random() * 0.2};
            `;
            
            wavesContainer.appendChild(wave);
        }
    }

    initInteractiveElements() {
        // Добавляем эффекты при наведении на карточки
        this.addCardHoverEffects();
        
        // Эффекты при клике
        this.addClickEffects();
    }

    addCardHoverEffects() {
        const cards = document.querySelectorAll('.aqua-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e, card);
            });
        });
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement('div');
        ripple.className = 'water-ripple';
        
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        ripple.style.cssText = `
            position: absolute;
            top: ${y}px;
            left: ${x}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, 
                rgba(0, 255, 234, 0.3) 0%, 
                transparent 70%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 1;
            animation: rippleExpand 0.6s ease-out;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode === element) {
                element.removeChild(ripple);
            }
        }, 600);
    }

    addClickEffects() {
        document.addEventListener('click', (e) => {
            this.createClickWave(e);
        });
    }

    createClickWave(event) {
        const wave = document.createElement('div');
        wave.className = 'click-wave';
        
        wave.style.cssText = `
            position: fixed;
            top: ${event.clientY}px;
            left: ${event.clientX}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, 
                rgba(0, 255, 234, 0.4) 0%, 
                transparent 70%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
            animation: clickWaveExpand 0.8s ease-out;
        `;
        
        document.body.appendChild(wave);
        
        setTimeout(() => {
            if (wave.parentNode) {
                document.body.removeChild(wave);
            }
        }, 800);
    }

    initPerformanceOptimization() {
        // Оптимизация для мобильных устройств
        if (this.isMobileDevice()) {
            this.reduceAnimations();
        }
        
        // Отслеживание производительности
        this.monitorPerformance();
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    reduceAnimations() {
        // Уменьшаем количество частиц на мобильных
        const particles = document.querySelectorAll('.particle, .bubble-particle');
        particles.forEach((particle, index) => {
            if (index > 5) {
                particle.style.display = 'none';
            }
        });
    }

    monitorPerformance() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const checkFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                // Автоматическое снижение качества при низком FPS
                if (fps < 30) {
                    this.reduceEffectsQuality();
                }
            }
            
            requestAnimationFrame(checkFPS);
        };
        
        checkFPS();
    }

    reduceEffectsQuality() {
        // Упрощаем эффекты при низком FPS
        const effects = document.querySelectorAll('.particle, .bubble-particle, .dynamic-wave');
        effects.forEach(effect => {
            if (Math.random() > 0.5) {
                effect.style.opacity = '0.3';
            }
        });
    }

    startAnimation() {
        // Основной цикл анимации
        const animate = () => {
            this.updateParticles();
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    updateParticles() {
        // Обновление состояния частиц (можно расширить)
    }

    // Публичные методы для управления эффектами
    createSplash(x, y) {
        this.createClickWave({ clientX: x, clientY: y });
    }

    setWaterIntensity(intensity) {
        document.documentElement.style.setProperty('--wave-intensity', intensity);
    }
}

// Добавляем стили для анимаций
if (!document.querySelector('#aqua-animations')) {
    const style = document.createElement('style');
    style.id = 'aqua-animations';
    style.textContent = `
        @keyframes rippleExpand {
            0% {
                width: 0;
                height: 0;
                opacity: 0.7;
            }
            100% {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
        
        @keyframes clickWaveExpand {
            0% {
                width: 0;
                height: 0;
                opacity: 0.6;
            }
            100% {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
        
        .water-ripple, .click-wave {
            animation-fill-mode: forwards;
        }
    `;
    document.head.appendChild(style);
}

// Создаем глобальный экземпляр
window.AquaEngine = new AquaEngine();

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.AquaEngine.init();
    });
} else {
    window.AquaEngine.init();
}
