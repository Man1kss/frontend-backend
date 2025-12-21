// Анимации водных эффектов для элементов интерфейса
class WaterAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupClickAnimations();
        this.initCounters();
    }

    setupScrollAnimations() {
        // Intersection Observer для анимации при скролле
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateOnScroll(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Наблюдаем за элементами для анимации
        document.querySelectorAll('.card, .skill-item, .achievement-item').forEach(el => {
            this.observer.observe(el);
        });
    }

    animateOnScroll(element) {
        element.style.animation = 'fadeInUp 0.6s ease forwards';
        
        if (element.classList.contains('skill-item')) {
            this.animateSkillBar(element);
        }
    }

    animateSkillBar(skillItem) {
        const progressBar = skillItem.querySelector('.water-progress-bar');
        if (progressBar) {
            const width = progressBar.getAttribute('data-width') || '0';
            setTimeout(() => {
                progressBar.style.width = width + '%';
            }, 200);
        }
    }

    setupHoverEffects() {
        // Эффекты при наведении на карточки проектов
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardLeave(card);
            });
        });

        // Эффекты для кнопок
        const buttons = document.querySelectorAll('.aqua-btn, .ocean-outline-btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.createButtonRipple(btn);
            });
        });
    }

    animateCardHover(card) {
        const icon = card.querySelector('.project-icon');
        if (icon) {
            icon.style.animation = 'waterRipple 1.5s ease-in-out';
        }
        
        const image = card.querySelector('.project-image');
        if (image) {
            image.style.transform = 'scale(1.05)';
        }
    }

    animateCardLeave(card) {
        const icon = card.querySelector('.project-icon');
        if (icon) {
            icon.style.animation = '';
        }
        
        const image = card.querySelector('.project-image');
        if (image) {
            image.style.transform = 'scale(1)';
        }
    }

    createButtonRipple(button) {
        const ripple = document.createElement('span');
        ripple.classList.add('button-ripple');
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: buttonRipple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupClickAnimations() {
        document.addEventListener('click', (e) => {
            // Создаем эффект ряби для body
            this.createBodyRipple(e);
        });
    }

    createBodyRipple(event) {
        const ripple = document.createElement('div');
        ripple.classList.add('body-ripple');
        
        ripple.style.cssText = `
            position: fixed;
            top: ${event.clientY}px;
            left: ${event.clientX}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, 
                rgba(0, 255, 234, 0.2) 0%, 
                transparent 70%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9998;
            animation: bodyRipple 0.8s ease-out;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
    }

    initCounters() {
        const counters = document.querySelectorAll('.counter');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// Добавляем CSS для анимаций
if (!document.querySelector('#water-animations-styles')) {
    const style = document.createElement('style');
    style.id = 'water-animations-styles';
    style.textContent = `
        @keyframes buttonRipple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes bodyRipple {
            0% {
                width: 0;
                height: 0;
                opacity: 0.5;
            }
            100% {
                width: 500px;
                height: 500px;
                opacity: 0;
            }
        }
        
        .button-ripple, .body-ripple {
            animation-fill-mode: forwards;
        }
    `;
    document.head.appendChild(style);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    new WaterAnimations();
});
