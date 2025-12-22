// Взаимодействия и оптимизация для морской темы
class OceanInteractions {
    constructor() {
        this.cursorGlow = document.getElementById('cursorGlow');
        this.init();
    }

    init() {
        this.setupCursorGlow();
        this.setupSmoothScrolling();
        this.setupPerformanceMonitor();
        this.setupMobileOptimizations();
    }

    setupCursorGlow() {
        if (!this.cursorGlow) return;

        document.addEventListener('mousemove', (e) => {
            this.moveCursorGlow(e);
        });

        document.addEventListener('mouseenter', () => {
            this.showCursorGlow();
        });

        document.addEventListener('mouseleave', () => {
            this.hideCursorGlow();
        });

        // Интерактивные элементы
        this.setupInteractiveHover();
    }

    moveCursorGlow(e) {
        this.cursorGlow.style.left = e.clientX + 'px';
        this.cursorGlow.style.top = e.clientY + 'px';
    }

    showCursorGlow() {
        this.cursorGlow.style.opacity = '1';
    }

    hideCursorGlow() {
        this.cursorGlow.style.opacity = '0';
    }

    setupInteractiveHover() {
        const interactiveElements = document.querySelectorAll('a, button, .nav-link, .card, .project-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.expandCursorGlow();
            });
            
            el.addEventListener('mouseleave', () => {
                this.shrinkCursorGlow();
            });
        });
    }

    expandCursorGlow() {
        this.cursorGlow.style.width = '200px';
        this.cursorGlow.style.height = '200px';
        this.cursorGlow.style.marginLeft = '-100px';
        this.cursorGlow.style.marginTop = '-100px';
        this.cursorGlow.style.background = 'radial-gradient(circle, rgba(0, 255, 234, 0.6) 0%, rgba(0, 180, 216, 0.3) 40%, transparent 70%)';
    }

    shrinkCursorGlow() {
        this.cursorGlow.style.width = '140px';
        this.cursorGlow.style.height = '140px';
        this.cursorGlow.style.marginLeft = '-70px';
        this.cursorGlow.style.marginTop = '-70px';
        this.cursorGlow.style.background = 'radial-gradient(circle, rgba(0, 255, 234, 0.4) 0%, rgba(0, 180, 216, 0.2) 40%, transparent 70%)';
    }

    setupSmoothScrolling() {
        // Плавная прокрутка для якорных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupPerformanceMonitor() {
        // Мониторинг FPS
        let frameCount = 0;
        let lastTime = performance.now();
        let fps = 60;

        const checkFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                // Автоматическая оптимизация при низком FPS
                if (fps < 30) {
                    this.optimizeForLowFPS();
                }
            }
            
            requestAnimationFrame(checkFPS);
        };
        
        checkFPS();
    }

    optimizeForLowFPS() {
        // Уменьшаем количество анимаций
        const particles = document.querySelectorAll('.particle, .bubble-particle');
        particles.forEach((particle, index) => {
            if (index % 2 === 0) {
                particle.style.display = 'none';
            }
        });

        // Упрощаем эффекты стекла
        document.documentElement.style.setProperty('--glass-bg', 'rgba(3, 4, 94, 0.25)');
    }

    setupMobileOptimizations() {
        if (this.isMobileDevice()) {
            this.applyMobileOptimizations();
        }
        
        // Обработка изменения ориентации
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 300);
        });
    }

    isMobileDevice() {
        return window.matchMedia('(max-width: 768px)').matches || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    applyMobileOptimizations() {
        // Убираем сложные эффекты на мобильных
        if (this.cursorGlow) {
            this.cursorGlow.style.display = 'none';
        }

        // Уменьшаем количество частиц
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index > 3) {
                particle.style.display = 'none';
            }
        });

        // Упрощаем анимации
        document.documentElement.style.setProperty('--wave-speed', '20s');
    }

    handleOrientationChange() {
        // Пересчитываем размеры после изменения ориентации
        setTimeout(() => {
            if (window.AquaEngine) {
                window.AquaEngine.init();
            }
        }, 100);
    }

    // Публичные методы для управления взаимодействиями
    enableEffects() {
        if (this.cursorGlow) {
            this.cursorGlow.style.display = 'block';
        }
        
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.display = 'block';
        });
    }

    disableEffects() {
        if (this.cursorGlow) {
            this.cursorGlow.style.display = 'none';
        }
        
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.display = 'none';
        });
    }
}

// Утилиты для работы с водой
class WaterUtils {
    static createSplash(x, y, intensity = 1) {
        if (window.AquaEngine) {
            window.AquaEngine.createSplash(x, y);
        }
    }

    static setWaterColor(color) {
        document.documentElement.style.setProperty('--aqua-accent', color);
    }

    static animateElement(element, animationName) {
        element.style.animation = `${animationName} 0.6s ease forwards`;
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    new OceanInteractions();
    
    // Глобальные утилиты
    window.WaterUtils = WaterUtils;
});

// Обработчики для touch устройств
document.addEventListener('touchstart', function(e) {
    // Создаем эффект при касании
    if (window.WaterUtils) {
        window.WaterUtils.createSplash(e.touches[0].clientX, e.touches[0].clientY, 0.5);
    }
}, { passive: true });
