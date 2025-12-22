// Функциональность дневника в морском стиле
class OceanDiary {
    constructor() {
        this.entries = JSON.parse(localStorage.getItem('oceanDiaryEntries')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadEntries();
        this.setupSearch();
        this.setupFilters();
    }

    setupEventListeners() {
        // Обработчики для модального окна
        const modal = document.getElementById('addEntryModal');
        if (modal) {
            modal.addEventListener('show.bs.modal', () => {
                this.prepareNewEntryForm();
            });

            modal.addEventListener('hidden.bs.modal', () => {
                this.resetEntryForm();
            });
        }

        // Обработчик сохранения записи
        const saveBtn = document.getElementById('saveEntryBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveNewEntry();
            });
        }

        // Обработчики для интерактивных элементов
        this.setupTimelineInteractions();
        this.setupGoalTracking();
    }

    prepareNewEntryForm() {
        // Устанавливаем текущую дату по умолчанию
        const dateInput = document.getElementById('entryDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }

        // Показываем/скрываем секцию прогресса в зависимости от статуса
        const statusSelect = document.getElementById('entryStatus');
        const progressSection = document.getElementById('progressSection');
        
        if (statusSelect && progressSection) {
            statusSelect.addEventListener('change', () => {
                this.toggleProgressSection(statusSelect.value);
            });
            
            // Инициализируем начальное состояние
            this.toggleProgressSection(statusSelect.value);
        }

        // Обработчик для range input
        const progressRange = document.getElementById('entryProgress');
        const progressValue = document.getElementById('progressValue');
        
        if (progressRange && progressValue) {
            progressRange.addEventListener('input', (e) => {
                progressValue.textContent = e.target.value + '%';
            });
        }
    }

    toggleProgressSection(status) {
        const progressSection = document.getElementById('progressSection');
        if (progressSection) {
            if (status === 'in-progress') {
                progressSection.style.display = 'block';
            } else {
                progressSection.style.display = 'none';
            }
        }
    }

    resetEntryForm() {
        const form = document.getElementById('diaryEntryForm');
        if (form) {
            form.reset();
        }
        
        const progressSection = document.getElementById('progressSection');
        if (progressSection) {
            progressSection.style.display = 'none';
        }
    }

    saveNewEntry() {
        const title = document.getElementById('entryTitle').value.trim();
        const date = document.getElementById('entryDate').value;
        const description = document.getElementById('entryDescription').value.trim();
        const status = document.getElementById('entryStatus').value;
        const progress = document.getElementById('entryProgress').value;

        // Валидация
        if (!title || !date || !description) {
            this.showNotification('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }

        // Собираем выбранные технологии
        const technologies = this.getSelectedTechnologies();

        // Создаем новую запись
        const newEntry = {
            id: Date.now(),
            title,
            date,
            description,
            status,
            progress: status === 'in-progress' ? parseInt(progress) : (status === 'completed' ? 100 : 0),
            technologies,
            createdAt: new Date().toISOString()
        };

        // Добавляем запись
        this.entries.unshift(newEntry);
        this.saveToLocalStorage();
        this.addEntryToTimeline(newEntry);
        
        // Показываем уведомление
        this.showNotification('Запись успешно добавлена в дневник!', 'success');
        
        // Закрываем модальное окно
        const modal = bootstrap.Modal.getInstance(document.getElementById('addEntryModal'));
        modal.hide();

        // Обновляем статистику
        this.updateStatistics();
    }

    getSelectedTechnologies() {
        const technologies = [];
        const techCheckboxes = [
            { id: 'techHTML', value: 'HTML/CSS' },
            { id: 'techJS', value: 'JavaScript' },
            { id: 'techReact', value: 'React' },
            { id: 'techNode', value: 'Node.js' }
        ];

        techCheckboxes.forEach(tech => {
            const checkbox = document.getElementById(tech.id);
            if (checkbox && checkbox.checked) {
                technologies.push(tech.value);
            }
        });

        return technologies;
    }

    addEntryToTimeline(entry) {
        const timeline = document.getElementById('timeline');
        if (!timeline) return;

        const entryElement = this.createTimelineEntry(entry);
        timeline.insertBefore(entryElement, timeline.firstChild);
        
        // Добавляем анимацию появления
        setTimeout(() => {
            entryElement.style.animation = 'fadeInUp 0.6s ease forwards';
        }, 100);
    }

    createTimelineEntry(entry) {
        const statusBadge = this.getStatusBadge(entry.status);
        const technologiesHTML = entry.technologies.map(tech => 
            `<span class="badge ocean-badge">${tech}</span>`
        ).join('');

        const progressHTML = entry.status === 'in-progress' ? `
            <div class="water-progress mt-3">
                <div class="water-progress-bar" data-width="${entry.progress}" style="width: ${entry.progress}%"></div>
            </div>
            <div class="d-flex justify-content-between ocean-text small mt-1">
                <span>${entry.progress}% завершено</span>
                <span>Осталось ${this.calculateTimeLeft(entry.progress)}</span>
            </div>
        ` : '';

        return document.createRange().createContextualFragment(`
            <article class="timeline-item mb-4">
                <div class="timeline-content ocean-glass p-4 rounded">
                    <div class="d-flex align-items-start">
                        <div class="timeline-badge ${entry.status} me-3">
                            <i class="bi ${this.getStatusIcon(entry.status)} water-icon" style="font-size: 1.5rem;"></i>
                        </div>
                        <div class="timeline-details flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start mb-2 flex-wrap">
                                <h4 class="text-glow mb-1">${entry.title}</h4>
                                ${statusBadge}
                            </div>
                            <p class="ocean-text small mb-2">
                                <i class="bi bi-calendar3 me-1 water-icon"></i>${this.formatDate(entry.date)}
                            </p>
                            <p class="ocean-text mb-3">${entry.description}</p>
                            <div class="d-flex flex-wrap gap-2 mb-3">
                                ${technologiesHTML}
                            </div>
                            ${progressHTML}
                        </div>
                    </div>
                </div>
            </article>
        `).firstElementChild;
    }

    getStatusBadge(status) {
        const badges = {
            'planned': '<span class="badge ocean-badge">Запланировано</span>',
            'in-progress': '<span class="badge aqua-badge">В процессе</span>',
            'completed': '<span class="badge aqua-badge">Завершено</span>'
        };
        return badges[status] || '';
    }

    getStatusIcon(status) {
        const icons = {
            'planned': 'bi-clock',
            'in-progress': 'bi-arrow-clockwise',
            'completed': 'bi-check-circle-fill'
        };
        return icons[status] || 'bi-circle';
    }

    formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }

    calculateTimeLeft(progress) {
        const remaining = 100 - progress;
        const weeks = Math.ceil(remaining / 10); // Предполагаем 10% в неделю
        return weeks === 1 ? '1 неделя' : `${weeks} недель`;
    }

    loadEntries() {
        const timeline = document.getElementById('timeline');
        if (!timeline) return;

        // Очищаем существующие записи (кроме статических)
        const staticEntries = timeline.querySelectorAll('.timeline-item');
        if (staticEntries.length > 4) {
            for (let i = 4; i < staticEntries.length; i++) {
                staticEntries[i].remove();
            }
        }

        // Добавляем сохраненные записи
        this.entries.forEach(entry => {
            this.addEntryToTimeline(entry);
        });
    }

    saveToLocalStorage() {
        localStorage.setItem('oceanDiaryEntries', JSON.stringify(this.entries));
    }

    setupSearch() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Поиск по записям...';
        searchInput.className = 'form-control ocean-input mb-3';
        
        searchInput.addEventListener('input', (e) => {
            this.filterEntries(e.target.value);
        });

        const timelineCard = document.querySelector('.card .card-body');
        if (timelineCard) {
            timelineCard.insertBefore(searchInput, timelineCard.querySelector('#timeline'));
        }
    }

    filterEntries(searchTerm) {
        const entries = document.querySelectorAll('.timeline-item');
        const searchLower = searchTerm.toLowerCase();

        entries.forEach(entry => {
            const title = entry.querySelector('h4').textContent.toLowerCase();
            const description = entry.querySelector('p.ocean-text').textContent.toLowerCase();
            const technologies = Array.from(entry.querySelectorAll('.badge')).map(badge => 
                badge.textContent.toLowerCase()
            );

            const matches = title.includes(searchLower) || 
                           description.includes(searchLower) ||
                           technologies.some(tech => tech.includes(searchLower));

            entry.style.display = matches ? 'block' : 'none';
            
            if (matches) {
                entry.style.animation = 'waterRippleEffect 0.6s ease';
                setTimeout(() => {
                    entry.style.animation = '';
                }, 600);
            }
        });
    }

    setupFilters() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'd-flex flex-wrap gap-2 mb-3';
        
        const filters = [
            { value: 'all', text: 'Все записи', icon: 'bi-filter' },
            { value: 'completed', text: 'Завершенные', icon: 'bi-check-circle' },
            { value: 'in-progress', text: 'В процессе', icon: 'bi-arrow-clockwise' },
            { value: 'planned', text: 'Запланированные', icon: 'bi-clock' }
        ];

        filters.forEach(filter => {
            const button = document.createElement('button');
            button.className = 'btn ocean-outline-btn';
            button.innerHTML = `<i class="bi ${filter.icon} me-1"></i>${filter.text}`;
            button.addEventListener('click', () => {
                this.applyFilter(filter.value);
            });
            filterContainer.appendChild(button);
        });

        const timelineCard = document.querySelector('.card .card-body');
        if (timelineCard) {
            const searchInput = timelineCard.querySelector('input[type="text"]');
            if (searchInput) {
                timelineCard.insertBefore(filterContainer, searchInput.nextSibling);
            } else {
                timelineCard.insertBefore(filterContainer, timelineCard.querySelector('#timeline'));
            }
        }
    }

    applyFilter(filterType) {
        const entries = document.querySelectorAll('.timeline-item');
        
        entries.forEach(entry => {
            if (filterType === 'all') {
                entry.style.display = 'block';
                return;
            }

            const status = entry.querySelector('.timeline-badge').classList[1];
            entry.style.display = status === filterType ? 'block' : 'none';
            
            if (status === filterType) {
                entry.style.animation = 'scaleIn 0.5s ease';
                setTimeout(() => {
                    entry.style.animation = '';
                }, 500);
            }
        });
    }

    setupTimelineInteractions() {
        document.addEventListener('click', (e) => {
            const timelineItem = e.target.closest('.timeline-item');
            if (timelineItem) {
                this.showEntryDetails(timelineItem);
            }
        });
    }

    showEntryDetails(entryElement) {
        const title = entryElement.querySelector('h4').textContent;
        const date = entryElement.querySelector('.ocean-text.small').textContent;
        const description = entryElement.querySelector('p.ocean-text').textContent;
        
        if (window.OceanNotifications) {
            window.OceanNotifications.info(
                `<strong>${title}</strong><br>${date}<br><br>${description}`,
                'info',
                5000
            );
        }
    }

    setupGoalTracking() {
        const goalItems = document.querySelectorAll('.goal-item');
        
        goalItems.forEach(item => {
            item.addEventListener('click', () => {
                this.updateGoalProgress(item);
            });
        });
    }

    updateGoalProgress(goalItem) {
        const progressBar = goalItem.querySelector('.water-progress-bar');
        const progressText = goalItem.querySelector('span:first-child');
        
        if (progressBar && progressText) {
            const currentWidth = parseInt(progressBar.style.width) || 0;
            const newWidth = Math.min(currentWidth + 10, 100);
            
            progressBar.style.width = newWidth + '%';
            progressText.textContent = newWidth + '%';
            
            // Водный эффект при обновлении прогресса
            if (window.WaterUtils) {
                const rect = goalItem.getBoundingClientRect();
                window.WaterUtils.createSplash(rect.left + rect.width/2, rect.top + rect.height/2, 0.3);
            }
            
            if (newWidth === 100) {
                if (window.OceanNotifications) {
                    window.OceanNotifications.success('Цель достигнута! 🎉');
                }
            }
        }
    }

    updateStatistics() {
        const completedEntries = this.entries.filter(entry => entry.status === 'completed').length;
        const inProgressEntries = this.entries.filter(entry => entry.status === 'in-progress').length;
        const totalHours = this.entries.reduce((total, entry) => {
            // Предполагаем 4 часа на запись
            return total + (entry.status === 'completed' ? 4 : 2);
        }, 50); // Базовое значение

        // Обновляем счетчики
        this.updateCounter('lessonsCounter', this.entries.length + 15);
        this.updateCounter('hoursCounter', totalHours);
        this.updateCounter('projectsCounter', completedEntries + 8);
        this.updateCounter('techCounter', this.getAllTechnologies().length + 8);
    }

    updateCounter(counterId, value) {
        const counter = document.querySelector(`[data-counter="${counterId}"]`);
        if (counter) {
            counter.textContent = value;
        }
    }

    getAllTechnologies() {
        const allTech = new Set();
        this.entries.forEach(entry => {
            entry.technologies.forEach(tech => allTech.add(tech));
        });
        return Array.from(allTech);
    }

    showNotification(message, type = 'info') {
        if (window.OceanNotifications) {
            window.OceanNotifications[type](message);
        } else {
            console[type](message);
        }
    }
}

// Добавляем CSS для дополнительных стилей дневника
if (!document.querySelector('#diary-styles')) {
    const style = document.createElement('style');
    style.id = 'diary-styles';
    style.textContent = `
        .ocean-timeline {
            position: relative;
        }
        
        .ocean-timeline::before {
            content: '';
            position: absolute;
            left: 30px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(to bottom, 
                transparent, 
                var(--aqua-accent), 
                transparent);
        }
        
        .timeline-badge {
            flex-shrink: 0;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
        }
        
        .timeline-badge.completed {
            background: rgba(168, 230, 207, 0.2);
            border: 2px solid var(--sea-foam);
        }
        
        .timeline-badge.in-progress {
            background: rgba(0, 255, 234, 0.2);
            border: 2px solid var(--aqua-accent);
            animation: pulse 2s infinite;
        }
        
        .timeline-badge.planned {
            background: rgba(144, 224, 239, 0.2);
            border: 2px solid var(--ocean-light);
        }
        
        .water-progress-large {
            background: rgba(3, 4, 94, 0.4);
            backdrop-filter: blur(12px);
            border-radius: 20px;
            height: 40px;
            overflow: hidden;
            box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(0, 255, 234, 0.2);
        }
        
        .water-progress-bar-large {
            height: 100%;
            background: linear-gradient(90deg, var(--aqua-accent), var(--ocean-light));
            border-radius: 20px;
            transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .water-progress-small {
            background: rgba(3, 4, 94, 0.3);
            border-radius: 10px;
            height: 12px;
            overflow: hidden;
        }
        
        .goal-item {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .goal-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 255, 234, 0.2);
        }
        
        .ocean-border {
            border-color: rgba(0, 255, 234, 0.3) !important;
        }
        
        .ocean-check:checked {
            background-color: var(--aqua-accent);
            border-color: var(--aqua-accent);
        }
        
        .ocean-range::-webkit-slider-thumb {
            background: var(--aqua-accent);
        }
        
        .ocean-range::-moz-range-thumb {
            background: var(--aqua-accent);
        }
        
        @keyframes pulse {
            0%, 100% {
                box-shadow: 0 0 0 0 rgba(0, 255, 234, 0.4);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(0, 255, 234, 0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new OceanDiary();
});
