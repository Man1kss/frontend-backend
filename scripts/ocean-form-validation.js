// Валидация формы в морском стиле с водными эффектами
class OceanFormValidation {
    constructor() {
        this.form = document.querySelector('.water-form');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.setupEventListeners();
        this.setupRealTimeValidation();
        this.setupSubmitHandler();
    }

    setupEventListeners() {
        // Валидация при потере фокуса
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    setupRealTimeValidation() {
        // Валидация в реальном времени для email
        const emailInput = this.form.querySelector('#email');
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                if (emailInput.value.length > 3) {
                    this.validateEmail(emailInput);
                }
            });
        }

        // Валидация длины сообщения в реальном времени
        const messageInput = this.form.querySelector('#message');
        if (messageInput) {
            messageInput.addEventListener('input', () => {
                this.validateMessageLength(messageInput);
            });
        }
    }

    setupSubmitHandler() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(e);
        });

        // Обработчик сброса формы
        this.form.addEventListener('reset', () => {
            this.resetFormValidation();
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldId = field.id;
        const errorElement = document.getElementById(`${fieldId}-error`);

        // Сбрасываем предыдущее состояние
        this.resetFieldState(field);

        // Проверка на пустое поле
        if (!value) {
            this.markFieldInvalid(field, errorElement, 'Это поле обязательно для заполнения');
            return false;
        }

        // Специфичные проверки для разных полей
        switch (fieldId) {
            case 'name':
                if (value.length < 2) {
                    this.markFieldInvalid(field, errorElement, 'Имя должно содержать минимум 2 символа');
                    return false;
                }
                break;

            case 'email':
                if (!this.isValidEmail(value)) {
                    this.markFieldInvalid(field, errorElement, 'Пожалуйста, введите корректный email адрес');
                    return false;
                }
                break;

            case 'message':
                if (value.length < 10) {
                    this.markFieldInvalid(field, errorElement, 'Сообщение должно содержать минимум 10 символов');
                    return false;
                }
                if (value.length > 1000) {
                    this.markFieldInvalid(field, errorElement, 'Сообщение не должно превышать 1000 символов');
                    return false;
                }
                break;
        }

        // Если все проверки пройдены
        this.markFieldValid(field);
        return true;
    }

    validateEmail(emailInput) {
        const value = emailInput.value.trim();
        const errorElement = document.getElementById('email-error');

        if (value && !this.isValidEmail(value)) {
            this.markFieldInvalid(emailInput, errorElement, 'Пожалуйста, введите корректный email адрес');
            return false;
        }

        this.markFieldValid(emailInput);
        return true;
    }

    validateMessageLength(messageInput) {
        const value = messageInput.value;
        const errorElement = document.getElementById('message-error');

        if (value.length < 10 && value.length > 0) {
            this.markFieldInvalid(messageInput, errorElement, 'Сообщение должно содержать минимум 10 символов');
            return false;
        }

        if (value.length >= 10) {
            this.markFieldValid(messageInput);
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    markFieldInvalid(field, errorElement, message) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        field.setAttribute('aria-invalid', 'true');

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        // Водный эффект ошибки
        this.createErrorEffect(field);
    }

    markFieldValid(field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        field.setAttribute('aria-invalid', 'false');

        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.style.display = 'none';
        }

        // Водный эффект успеха
        this.createSuccessEffect(field);
    }

    resetFieldState(field) {
        field.classList.remove('is-invalid', 'is-valid');
        field.setAttribute('aria-invalid', 'false');

        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    resetFormValidation() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            this.resetFieldState(field);
        });

        // Водный эффект сброса
        this.createResetEffect();
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        // Валидация всех полей
        const fields = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showFormError('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        // Показываем индикатор загрузки
        this.showLoadingState();

        try {
            // Имитация отправки формы
            await this.submitFormData();

            // Успешная отправка
            this.showSuccessState();
            this.form.reset();
            this.resetFormValidation();

        } catch (error) {
            this.showFormError('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
        } finally {
            this.hideLoadingState();
        }
    }

    async submitFormData() {
        // Имитация задержки сети
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 90% шанс успешной отправки для демонстрации
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }

    showLoadingState() {
        const submitBtn = this.form.querySelector('.ocean-submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Отправка...';
            submitBtn.classList.add('loading');
        }
    }

    hideLoadingState() {
        const submitBtn = this.form.querySelector('.ocean-submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send me-2"></i>Отправить сообщение';
            submitBtn.classList.remove('loading');
        }
    }

    showSuccessState() {
        // Показываем модальное окно успеха
        if (typeof showSuccessModal === 'function') {
            showSuccessModal();
        }

        // Обновляем live region для скринридеров
        const statusElement = document.getElementById('form-status');
        if (statusElement) {
            statusElement.textContent = 'Форма успешно отправлена. Спасибо за ваше сообщение!';
        }

        // Водный эффект успеха для всей формы
        this.createFormSuccessEffect();
    }

    showFormError(message) {
        if (window.OceanNotifications) {
            window.OceanNotifications.error(message);
        }

        // Фокус на первое поле с ошибкой
        const firstError = this.form.querySelector('.is-invalid');
        if (firstError) {
            firstError.focus();
        }
    }

    // Водные эффекты для валидации
    createErrorEffect(field) {
        if (window.WaterUtils) {
            const rect = field.getBoundingClientRect();
            window.WaterUtils.createSplash(rect.left + rect.width/2, rect.top, 0.2);
        }

        // Анимация тряски
        field.style.animation = 'waterShake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }

    createSuccessEffect(field) {
        if (window.WaterUtils) {
            const rect = field.getBoundingClientRect();
            window.WaterUtils.createSplash(rect.left + rect.width/2, rect.top + rect.height, 0.4);
        }
    }

    createResetEffect() {
        if (window.WaterUtils) {
            const formRect = this.form.getBoundingClientRect();
            window.WaterUtils.createSplash(formRect.left + formRect.width/2, formRect.top + formRect.height/2, 0.6);
        }
    }

    createFormSuccessEffect() {
        // Эффект ряби для всей формы
        const form = this.form;
        form.style.animation = 'waterRippleEffect 1s ease-in-out';
        setTimeout(() => {
            form.style.animation = '';
        }, 1000);

        // Создаем несколько пузырьков успеха
        if (window.AquaEngine) {
            const formRect = form.getBoundingClientRect();
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    window.AquaEngine.createSplash(
                        formRect.left + Math.random() * formRect.width,
                        formRect.top + Math.random() * formRect.height,
                        0.3
                    );
                }, i * 200);
            }
        }
    }
}

// Добавляем CSS для анимаций валидации
if (!document.querySelector('#form-validation-styles')) {
    const style = document.createElement('style');
    style.id = 'form-validation-styles';
    style.textContent = `
        .water-form .is-invalid {
            border-color: #ff6b6b !important;
            box-shadow: 0 0 0 0.2rem rgba(255, 107, 107, 0.25) !important;
        }
        
        .water-form .is-valid {
            border-color: #a8e6cf !important;
            box-shadow: 0 0 0 0.2rem rgba(168, 230, 207, 0.25) !important;
        }
        
        .ocean-input:focus,
        .ocean-select:focus,
        .ocean-textarea:focus {
            border-color: var(--aqua-accent) !important;
            box-shadow: 0 0 0 0.2rem rgba(0, 255, 234, 0.25) !important;
        }
        
        .input-focused {
            position: relative;
        }
        
        .input-focused::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 2px;
            background: var(--aqua-accent);
            transform: translateX(-50%);
            animation: inputFocusLine 0.3s ease forwards;
        }
        
        @keyframes inputFocusLine {
            to {
                width: 100%;
            }
        }
        
        @keyframes waterShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .pulse-warning {
            animation: pulseWarning 1s infinite;
        }
        
        @keyframes pulseWarning {
            0%, 100% { 
                transform: scale(1);
                background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
            }
            50% { 
                transform: scale(1.05);
                background: linear-gradient(135deg, #ff8e8e, #ff6b6b);
            }
        }
        
        .ocean-submit-btn.loading {
            position: relative;
            overflow: hidden;
        }
        
        .ocean-submit-btn.loading::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, 
                transparent, 
                rgba(255, 255, 255, 0.3), 
                transparent);
            animation: loadingShimmer 1.5s infinite;
        }
        
        @keyframes loadingShimmer {
            0% { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(100%) rotate(45deg); }
        }
        
        .contact-icon {
            font-size: 3rem;
            animation: floatIcon 6s ease-in-out infinite;
        }
        
        .contact-link {
            transition: all 0.3s ease;
            padding: 0.5rem 1rem;
            border-radius: 8px;
        }
        
        .contact-link:hover {
            transform: translateY(-2px);
            text-shadow: 0 0 10px rgba(0, 255, 234, 0.5);
        }
        
        .ocean-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(3, 4, 94, 0.8);
            backdrop-filter: blur(5px);
            z-index: 1040;
        }
        
        .ocean-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1050;
            min-width: 300px;
            max-width: 500px;
            width: 90%;
        }
    `;
    document.head.appendChild(style);
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new OceanFormValidation();
});
