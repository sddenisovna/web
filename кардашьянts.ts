export {};





console.log('✅ кардашьянts.ts загружен');


interface AuthAPI {
    register: (name: string, email: string, phone: string, password: string) => { success: boolean; message: string; user?: any };
    login: (email: string, password: string) => { success: boolean; message: string; user?: any };
    getCurrentUser: () => any;
    isLoggedIn: () => boolean;
    logout: () => void;
}

declare global {
    interface Window {
        authAPI?: AuthAPI;
    }
}


const trainerData = {
    id: 3,
    name: 'Кристина Кардашьян',
    title: 'тренер групповых программ',
    experience: 10,
    clubs: ['Самарский'],
    specializations: ['танцы', 'пилатес', 'барре'],
    phone: '+7 (800) 555-35-35',
    email: 'k.kardashian@tochkaofbalance.ru',
    schedule: {
        monday: '14:00-21:00',
        tuesday: '14:00-21:00',
        wednesday: '14:00-21:00',
        thursday: '14:00-21:00',
        friday: '14:00-21:00',
        saturday: '11:00-15:00',
        sunday: 'выходной'
    }
};


function getElement<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}

function showNotification(message: string, isError: boolean = false): void {
    let toast = document.querySelector('.toast-notification') as HTMLDivElement;
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.background = isError ? '#f44336' : '#ff99b8';
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


function formatSchedule(): string {
    const days = [
        { key: 'monday', name: 'Понедельник' },
        { key: 'tuesday', name: 'Вторник' },
        { key: 'wednesday', name: 'Среда' },
        { key: 'thursday', name: 'Четверг' },
        { key: 'friday', name: 'Пятница' },
        { key: 'saturday', name: 'Суббота' },
        { key: 'sunday', name: 'Воскресенье' }
    ];
    
    return days
        .filter(day => trainerData.schedule[day.key as keyof typeof trainerData.schedule])
        .map(day => `${day.name}: ${trainerData.schedule[day.key as keyof typeof trainerData.schedule]}`)
        .join('\n');
}


function showSchedule(): void {
    const scheduleText = formatSchedule();
    alert(`📅 расписание ${trainerData.name}:\n\n${scheduleText}\n\nКлуб: ${trainerData.clubs.join(', ')}`);
}


let selectedTrainerId: number | null = null;

function bookToTrainer(): void {
    if (window.authAPI && window.authAPI.isLoggedIn()) {

        const trainingData = {
            id: Date.now(),
            title: `тренировка с ${trainerData.name}`,
            trainer: trainerData.name,
            time: 'по расписанию',
            district: trainerData.clubs[0]
        };
        
        const existing = localStorage.getItem('myTrainings');
        let trainings = existing ? JSON.parse(existing) : [];
        trainings.push(trainingData);
        localStorage.setItem('myTrainings', JSON.stringify(trainings));
        
        showNotification(`✨ Вы записаны на тренировку к ${trainerData.name}! ✨`);
    } else {
        selectedTrainerId = trainerData.id;
        const infoBlock = getElement('modalTrainingInfo');
        if (infoBlock) {
            infoBlock.style.display = 'block';
            infoBlock.innerHTML = `
                <p><strong>📋 вы записываетесь к тренеру:</strong></p>
                <p><strong>${trainerData.name}</strong></p>
                <p>👤 ${trainerData.title}</p>
                <p>📍 Клуб: ${trainerData.clubs.join(', ')}</p>
                <p>для записи войдите или зарегистрируйтесь</p>
            `;
        }
        openModal();
    }
}


function updateLoginButton(): void {
    const loginBtn = document.querySelector('.header .btn-outline') as HTMLElement;
    if (!loginBtn) return;
    
    if (window.authAPI && window.authAPI.isLoggedIn()) {
        const user = window.authAPI.getCurrentUser();
        if (user) {
            loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${user.name}`;
            loginBtn.onclick = () => {
                window.location.href = '../кабинет/Кабинетhtml.html';
            };
        }
    } else {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> войти`;
        loginBtn.onclick = () => openModal();
    }
}


function initReviews(): void {
    const allReviewsLink = document.querySelector('.all-reviews-link');
    if (allReviewsLink) {
        allReviewsLink.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('📋 скоро здесь появятся все отзывы!');
        });
    }
}


function initContacts(): void {
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.querySelector('span')?.textContent;
            showNotification(`📱 связь с тренером через ${platform} появится скоро`);
        });
    });
}


function openModal(): void {
    const modal = getElement('auth-modal');
    if (modal) modal.classList.add('active');
}

function closeModal(): void {
    const modal = getElement('auth-modal');
    if (modal) modal.classList.remove('active');
}

function initModal(): void {
    const modal = getElement('auth-modal');
    const closeBtn = getElement('modalCloseBtn');
    const loginHeaderBtn = document.querySelector('.header .btn-outline') as HTMLElement;
    const loginTab = document.querySelector('[data-tab="login"]');
    const registerTab = document.querySelector('[data-tab="register"]');
    const loginForm = getElement('login-form');
    const registerForm = getElement('register-form');
    const switchToRegister = getElement('switch-to-register');
    const switchToLogin = getElement('switch-to-login');
    const loginSubmit = getElement('login-submit-btn');
    const registerSubmit = getElement('register-submit-btn');

    closeBtn?.addEventListener('click', closeModal);
    
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    loginHeaderBtn?.addEventListener('click', () => {
        const infoBlock = getElement('modalTrainingInfo');
        if (infoBlock) infoBlock.style.display = 'none';
        selectedTrainerId = null;
        openModal();
    });

    function switchTab(tab: 'login' | 'register'): void {
        if (tab === 'login') {
            loginTab?.classList.add('active');
            registerTab?.classList.remove('active');
            loginForm?.classList.add('active');
            registerForm?.classList.remove('active');
        } else {
            loginTab?.classList.remove('active');
            registerTab?.classList.add('active');
            loginForm?.classList.remove('active');
            registerForm?.classList.add('active');
        }
    }

    loginTab?.addEventListener('click', () => switchTab('login'));
    registerTab?.addEventListener('click', () => switchTab('register'));
    switchToRegister?.addEventListener('click', () => switchTab('register'));
    switchToLogin?.addEventListener('click', () => switchTab('login'));


    loginSubmit?.addEventListener('click', async () => {
        const email = (getElement<HTMLInputElement>('login-email'))?.value || '';
        const password = (getElement<HTMLInputElement>('login-password'))?.value || '';
        
        if (!email || !password) {
            showNotification('пожалуйста, заполните все поля', true);
            return;
        }
        
        if (window.authAPI) {
            const result = await window.authAPI.login(email, password);
            if (result.success) {
                showNotification(result.message);
                closeModal();
                updateLoginButton();
                

                if (selectedTrainerId) {
                    const trainingData = {
                        id: Date.now(),
                        title: `тренировка с ${trainerData.name}`,
                        trainer: trainerData.name,
                        time: 'по расписанию',
                        district: trainerData.clubs[0]
                    };
                    const existing = localStorage.getItem('myTrainings');
                    let trainings = existing ? JSON.parse(existing) : [];
                    trainings.push(trainingData);
                    localStorage.setItem('myTrainings', JSON.stringify(trainings));
                    showNotification(`✨ Вы записаны на тренировку к ${trainerData.name}! ✨`);
                    selectedTrainerId = null;
                }
                
                const loginEmail = getElement<HTMLInputElement>('login-email');
                const loginPassword = getElement<HTMLInputElement>('login-password');
                if (loginEmail) loginEmail.value = '';
                if (loginPassword) loginPassword.value = '';
            } else {
                showNotification(result.message, true);
            }
        } else {
            showNotification(`✨ добро пожаловать, ${email.split('@')[0]}! ✨`);
            closeModal();
            updateLoginButton();
            
            if (selectedTrainerId) {
                const trainingData = {
                    id: Date.now(),
                    title: `тренировка с ${trainerData.name}`,
                    trainer: trainerData.name,
                    time: 'по расписанию',
                    district: trainerData.clubs[0]
                };
                const existing = localStorage.getItem('myTrainings');
                let trainings = existing ? JSON.parse(existing) : [];
                trainings.push(trainingData);
                localStorage.setItem('myTrainings', JSON.stringify(trainings));
                showNotification(`✨ Вы записаны на тренировку к ${trainerData.name}! ✨`);
                selectedTrainerId = null;
            }
            
            const loginEmail = getElement<HTMLInputElement>('login-email');
            const loginPassword = getElement<HTMLInputElement>('login-password');
            if (loginEmail) loginEmail.value = '';
            if (loginPassword) loginPassword.value = '';
        }
    });


    registerSubmit?.addEventListener('click', async () => {
        const name = (getElement<HTMLInputElement>('register-name'))?.value || '';
        const email = (getElement<HTMLInputElement>('register-email'))?.value || '';
        const phone = (getElement<HTMLInputElement>('register-phone'))?.value || '';
        const password = (getElement<HTMLInputElement>('register-password'))?.value || '';
        
        if (!name || !email || !password) {
            showNotification('пожалуйста, заполните имя, email и пароль', true);
            return;
        }
        
        if (password.length < 4) {
            showNotification('пароль должен быть не менее 4 символов', true);
            return;
        }
        
        if (window.authAPI) {
            const result = await window.authAPI.register(name, email, phone, password);
            if (result.success) {
                showNotification(result.message);
                closeModal();
                updateLoginButton();
                
                if (selectedTrainerId) {
                    const trainingData = {
                        id: Date.now(),
                        title: `тренировка с ${trainerData.name}`,
                        trainer: trainerData.name,
                        time: 'по расписанию',
                        district: trainerData.clubs[0]
                    };
                    const existing = localStorage.getItem('myTrainings');
                    let trainings = existing ? JSON.parse(existing) : [];
                    trainings.push(trainingData);
                    localStorage.setItem('myTrainings', JSON.stringify(trainings));
                    showNotification(`✨ Вы записаны на тренировку к ${trainerData.name}! ✨`);
                    selectedTrainerId = null;
                }
                
                const regName = getElement<HTMLInputElement>('register-name');
                const regEmail = getElement<HTMLInputElement>('register-email');
                const regPhone = getElement<HTMLInputElement>('register-phone');
                const regPassword = getElement<HTMLInputElement>('register-password');
                if (regName) regName.value = '';
                if (regEmail) regEmail.value = '';
                if (regPhone) regPhone.value = '';
                if (regPassword) regPassword.value = '';
            } else {
                showNotification(result.message, true);
            }
        } else {
            showNotification(`✨ ${name}, добро пожаловать в точку баланса! ✨`);
            closeModal();
            updateLoginButton();
            
            if (selectedTrainerId) {
                const trainingData = {
                    id: Date.now(),
                    title: `тренировка с ${trainerData.name}`,
                    trainer: trainerData.name,
                    time: 'по расписанию',
                    district: trainerData.clubs[0]
                };
                const existing = localStorage.getItem('myTrainings');
                let trainings = existing ? JSON.parse(existing) : [];
                trainings.push(trainingData);
                localStorage.setItem('myTrainings', JSON.stringify(trainings));
                showNotification(`✨ Вы записаны на тренировку к ${trainerData.name}! ✨`);
                selectedTrainerId = null;
            }
            
            const regName = getElement<HTMLInputElement>('register-name');
            const regEmail = getElement<HTMLInputElement>('register-email');
            const regPhone = getElement<HTMLInputElement>('register-phone');
            const regPassword = getElement<HTMLInputElement>('register-password');
            if (regName) regName.value = '';
            if (regEmail) regEmail.value = '';
            if (regPhone) regPhone.value = '';
            if (regPassword) regPassword.value = '';
        }
    });
}


function initBackButton(): void {
    const backLink = document.querySelector('.back-link');
    if (backLink) {
        backLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '../тренеры/тренерыhtml.html';
        });
    }
}


function initStickyHeader(): void {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}


function initSubscription(): void {
    const subscribeBtns = document.querySelectorAll('.footer-col .btn-primary');
    subscribeBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.footer-col');
            const input = parent?.querySelector('input[type="email"]') as HTMLInputElement;
            if (input && input.value) {
                showNotification(`💌 спасибо за подписку! письма будут приходить на ${input.value}`);
                input.value = '';
            } else {
                showNotification('пожалуйста, введите e-mail', true);
            }
        });
    });
}


function initCardsAnimation(): void {
    const cards = document.querySelectorAll('.bubble-card');
    cards.forEach((card, index) => {
        (card as HTMLElement).style.opacity = '0';
        (card as HTMLElement).style.transform = 'translateY(20px)';
        (card as HTMLElement).style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        setTimeout(() => {
            (card as HTMLElement).style.opacity = '1';
            (card as HTMLElement).style.transform = 'translateY(0)';
        }, index * 100);
    });
}


function renderTrainerData(): void {
    const nameEl = document.getElementById('trainerName');
    const roleEl = document.getElementById('trainerRole');
    const statsEl = document.getElementById('trainerStats');
    const clubsEl = document.getElementById('clubsList');
    const specTags = document.querySelector('.spec-tags');
    
    if (nameEl) nameEl.textContent = trainerData.name;
    if (roleEl) roleEl.textContent = trainerData.title;
    if (statsEl) statsEl.innerHTML = `<i class="fas fa-calendar-alt"></i> стаж ${trainerData.experience} лет`;
    if (clubsEl) clubsEl.innerHTML = trainerData.clubs.map(c => `<li>${c}</li>`).join('');
    if (specTags) {
        specTags.innerHTML = trainerData.specializations.map(s => `<span class="spec-tag">${s}</span>`).join('');
    }
}


function initBookButton(): void {
    const bookBtns = document.querySelectorAll('.btn-detail, .book-trainer-btn, .schedule-link');
    bookBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            bookToTrainer();
        });
    });
}


function initScheduleButton(): void {
    const scheduleBtn = document.getElementById('scheduleBtn');
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', showSchedule);
    }
}


function init(): void {
    console.log('🚀 Страница тренера Кристина Кардашьян загружена');
    renderTrainerData();
    initScheduleButton();
    initBookButton();
    initBackButton();
    initReviews();
    initContacts();
    initModal();
    initSubscription();
    initStickyHeader();
    updateLoginButton(); // ВАЖНО: обновляем кнопку при загрузке
    initCardsAnimation();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
