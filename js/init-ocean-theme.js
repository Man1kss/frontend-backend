// Главный файл инициализации морской темы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌊 Инициализация морской темы...');
    
    // Инициализация всех систем
    try {
        // Основной движок водных эффектов
        if (typeof AquaEngine !== 'undefined') {
            AquaEngine.init();
        }
        
        // Система уведомлений
        if (typeof OceanNotifications !== 'undefined') {
            window.notifications = OceanNotifications;
        }
        
        // Взаимодействия
        if (typeof OceanInteractions !== 'undefined') {
            new OceanInteractions();
        }
        
        // Анимации элементов
        if (typeof WaterAnimations !== 'undefined') {
            new WaterAnimations();
        }
        
        console.log('✅ Морская тема успешно инициализирована');
        
        // Показываем приветственное уведомление
        setTimeout(() => {
            if (window.notifications) {
                window.notifications.success('Морская тема активирована! 🌊', 3000);
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Ошибка инициализации морской темы:', error);
    }
    
    // Оптимизация производительности
    setupPerformanceOptimizations();
});

function setupPerformanceOptimizations() {
    // Ленивая загрузка изображений
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Предзагрузка критических ресурсов
    const criticalResources = [
        'style/animations.css',
        'js/water-animations.js'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        document.head.appendChild(link);
    });
}

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    
    if (window.notifications) {
        window.notifications.error('Произошла ошибка при загрузке страницы');
    }
});

// Обработка изменения видимости страницы
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Страница не видна - уменьшаем нагрузку
        reduceEffectsWhenHidden();
    } else {
        // Страница снова видна - восстанавливаем эффекты
        restoreEffectsWhenVisible();
    }
});

function reduceEffectsWhenHidden() {
    // Уменьшаем интенсивность анимаций
    document.documentElement.style.setProperty('--wave-speed', '30s');
    
    // Приостанавливаем сложные вычисления
    if (window.AquaEngine) {
        window.AquaEngine.pauseEffects();
    }
}

function restoreEffectsWhenVisible() {
    // Восстанавливаем нормальную скорость анимаций
    document.documentElement.style.setProperty('--wave-speed', '15s');
    
    // Возобновляем эффекты
    if (window.AquaEngine) {
        window.AquaEngine.resumeEffects();
    }
}
