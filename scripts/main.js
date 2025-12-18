class PortfolioApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.initNavigation();
        this.initCart();
        this.initForms();
        this.initTheme();
        this.initSmoothScroll();
        this.initModals();
    }

    // АКТИВНАЯ НАВИГАЦИЯ
    initNavigation() {
        document.querySelectorAll('.nav-link, .navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                document.querySelectorAll('.nav-link, .navbar-nav .nav-link')
                    .forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });

            if (
                link.href === window.location.href ||
                link.getAttribute('href') === window.location.pathname.split('/').pop()
            ) {
                link.classList.add('active');
            }
        });
    }

    // КОРЗИНА
    initCart() {
        document.querySelectorAll('.add-to-cart, .btn-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget;
                this.addToCart(button.dataset);
                this.updateCartUI();
            });
        });
        this.updateCartUI();
    }

    addToCart(data) {
        const product = {
            id: data.id || Date.now(),
            name: data.name || 'Товар',
            price: parseInt(data.price) || 0,
            quantity: 1
        };

        const existing = this.cart.find(item => item.id == product.id);
        if (existing) {
            existing.quantity++;
        } else {
            this.cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartUI() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        document.querySelectorAll('#cartCount, #cartBadge').forEach(el => {
            el.textContent = totalItems;
        });
        const itemsEl = document.getElementById('cartTotalItems');
        const priceEl = document.getElementById('cartTotalPrice');
        if (itemsEl) itemsEl.textContent = totalItems;
        if (priceEl) priceEl.textContent = totalPrice + '₽';
    }

    // ФОРМЫ + МАСКА ТЕЛЕФОНА
    initForms() {
        document.querySelectorAll('input[type="tel"], #phone').forEach(input => {
            input.addEventListener('input', this.formatPhone);
        });

        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e, form));
        });
    }

    formatPhone(e) {
        let value = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (value.startsWith('8')) value = '7' + value.slice(1);

        const parts = [];
        if (value.length >= 1) parts.push('7');
        if (value.length >= 4) parts.push(value.slice(1, 4));
        if (value.length >= 7) parts.push(value.slice(4, 7));
        if (value.length >= 9) parts.push('-' + value.slice(7, 9));
        if (value.length >= 11) parts.push('-' + value.slice(9, 11));

        e.target.value = parts.join('');
    }

    handleFormSubmit(e, form) {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        console.log('📤 Форма отправлена:', data);
        alert('✅ Сообщение отправлено! Спасибо!');
        form.reset();

        const modal = document.querySelector('dialog[open], .modal.show');
        modal?.close?.();
    }

    // МОДАЛЬНЫЕ ОКНА
    initModals() {
        document.querySelectorAll('dialog').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.close();
            });
        });

        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.dataset.modal;
                document.getElementById(modalId)?.showModal?.();
            });
        });
    }

    // ТЕМНАЯ ТЕМА
    initTheme() {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('theme-dark');
        }

        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            document.body.classList.toggle('theme-dark');
            localStorage.setItem(
                'theme',
                document.body.classList.contains('theme-dark') ? 'dark' : 'light'
            );
        });
    }

    // SMOOTH SCROLL
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                target?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }
}

// Один общий экземпляр приложения на всю страницу
let app;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new PortfolioApp();
    });
} else {
    app = new PortfolioApp();
}

// Глобальные функции
window.updateCartUI = () => app && app.updateCartUI();
window.formatPhone = (e) => app && app.formatPhone(e);
window.openPracticeModal = (num) => alert(`Практика №${num}`);
window.showCartModal = () => {
    const cartModalEl = document.getElementById('cartModal');
    if (!cartModalEl) return;
    const cartModal = new bootstrap.Modal(cartModalEl);
    cartModal.show();
};
window.checkout = () => {
    if (!app) return;
    const total = app.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    alert(`Заказ на ${total}₽ оформлен!`);
};
