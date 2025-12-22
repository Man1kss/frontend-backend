// Система уведомлений в морском стиле
class OceanNotifications {
    constructor() {
        this.container = document.getElementById('notificationContainer');
        this.init();
    }

    init() {
        if (!this.container) {
            this.createContainer();
        }
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notificationContainer';
        this.container.className = 'ocean-notifications';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `ocean-notification notification-${type}`;
        
        const icon = this.getIconForType(type);
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <span class="notification-message">${message}</span>
            </div>
            <button class="notification-close" aria-label="Закрыть уведомление">
                <i class="bi bi-x"></i>
            </button>
        `;

        // Стили для уведомления
        notification.style.cssText = `
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            max-width: 400px;
            animation: slideInRight 0.3s ease forwards;
            box-shadow: var(--glass-shadow);
            color: var(--ocean-glow);
        `;

        this.container.appendChild(notification);

        // Кнопка закрытия
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hide(notification);
        });

        // Автоматическое скрытие
        if (duration > 0) {
            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }

        return notification;
    }

    hide(notification) {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getIconForType(type) {
        const icons = {
            info: '<i class="bi bi-info-circle"></i>',
            success: '<i class="bi bi-check-circle"></i>',
            warning: '<i class="bi bi-exclamation-triangle"></i>',
            error: '<i class="bi bi-x-circle"></i>'
        };
        return icons[type] || icons.info;
    }

    // Быстрые методы для разных типов уведомлений
    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }

    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    }

    warning(message, duration = 5000) {
        return this.show(message, 'warning', duration);
    }

    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }
}

// Добавляем стили для анимаций уведомлений
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-icon {
            font-size: 1.2rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--ocean-glow);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            transition: background-color 0.2s ease;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .notification-info {
            border-left: 4px solid var(--ocean-medium);
        }
        
        .notification-success {
            border-left: 4px solid var(--sea-foam);
        }
        
        .notification-warning {
            border-left: 4px solid var(--coral);
        }
        
        .notification-error {
            border-left: 4px solid #ff4757;
        }
    `;
    document.head.appendChild(style);
}

// Глобальный экземпляр
window.OceanNotifications = new OceanNotifications();
