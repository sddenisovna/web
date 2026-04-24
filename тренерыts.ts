export {};






declare global {
    interface Window {
        authAPI?: {
            register: (name: string, email: string, phone: string, password: string) => { success: boolean; message: string; user?: any };
            login: (email: string, password: string) => { success: boolean; message: string; user?: any };
            getCurrentUser: () => any;
            isLoggedIn: () => boolean;
            logout: () => void;
        };
    }
}


const trainersData = [
    {
        id: 1,
        name: 'Анжелика Джоли',
        type: 'групповой',
        specialty: 'йога',
        experience: 19,
        club: 'Железнодорожный',
        image: 'https://i.pinimg.com/736x/0c/07/b3/0c07b328bdd49adff1dff143bd282f04.jpg',
        pageUrl: '../джоли/джолиhtml.html'
    },
    {
        id: 2,
        name: 'Александра Йоханссон',
        type: 'групповой',
        specialty: 'пилатес',
        experience: 6,
        club: 'Ленинский',
        image: 'https://i.playground.ru/e/ICeV7ma97FRmRuNYaiEmig.jpeg',
        pageUrl: '../йоханссон/йоханссонhtml.html'
    },
    {
        id: 3,
        name: 'Карина Кардашьян',
        type: 'групповой',
        specialty: 'танцы, пилатес',
        experience: 10,
        club: 'Самарский',
        image: 'https://avatars.mds.yandex.net/i?id=641981fb2b61cad86ef95b2993b9f3a2_l-5336269-images-thumbs&n=13',
        pageUrl: '../кардашьян/кардашьянhtml.html'
    },
    {
        id: 4,
        name: 'Софья Суини',
        type: 'персональный',
        specialty: 'стрейчинг, силовые',
        experience: 5,
        club: 'Советский',
        image: 'https://s.yimg.com/ny/api/res/1.2/uw5NLSelFYqCuGmztZkNKQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTU0MDtjZj13ZWJw/https://media.zenfs.com/en/us_magazine_896/37d58a873dd2830449676ca62872c874',
        pageUrl: '../суини/суиниhtml.html'
    }
];


function getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Элемент с id "${id}" не найден`);
    return element as T;
}

function getOptionalElement<T extends HTMLElement>(id: string): T | null {
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


function goToTrainerPage(url: string): void {
    if (url) {
        window.location.href = url;
    } else {
        showNotification('😕 страница тренера в разработке', true);
    }
}


function renderTrainers(): void {
    const container = getElement<HTMLElement>('trainersGrid');
    const typeFilter = (getOptionalElement<HTMLSelectElement>('typeFilter'))?.value || 'all';
    const clubFilter = (getOptionalElement<HTMLSelectElement>('clubFilter'))?.value || 'all';
    const specialtyFilter = (getOptionalElement<HTMLSelectElement>('specialtyFilter'))?.value || 'all';

    const filtered = trainersData.filter(trainer => {
        if (typeFilter !== 'all' && (trainer as any).type !== typeFilter) return false;
        if (clubFilter !== 'all' && (trainer as any).club !== clubFilter) return false;
        if (specialtyFilter !== 'all' && !(trainer as any).specialty.includes(specialtyFilter)) return false;
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 60px; color: #515152;">😔 ничего не найдено</div>`;
        return;
    }

    container.innerHTML = filtered.map(trainer => `
        <div class="trainer-card" data-url="${(trainer as any).pageUrl}">
            <div class="trainer-photo">
                <img src="${(trainer as any).image}" alt="${(trainer as any).name}" loading="lazy">
            </div>
            <div class="trainer-info">
                <div class="trainer-name">${(trainer as any).name}</div>
                <div class="trainer-type">${(trainer as any).type === 'персональный' ? 'персональный тренер' : 'тренер групповых'}</div>
                <div class="trainer-stats">
                    <span class="stat-badge"><i class="fas fa-clock"></i> стаж ${(trainer as any).experience} лет</span>
                    <span class="stat-badge"><i class="fas fa-tag"></i> ${(trainer as any).specialty}</span>
                </div>
                <div class="trainer-club">
                    <i class="fas fa-location-dot"></i> ${(trainer as any).club}
                </div>
                <div class="card-buttons">
                    <button class="btn-detail" data-id="${(trainer as any).id}">подробнее</button>
                    <button class="btn-schedule" data-id="${(trainer as any).id}">посмотреть расписание</button>
                </div>
            </div>
        </div>
    `).join('');


    document.querySelectorAll('.trainer-card').forEach((card: Element) => {
        const url = card.getAttribute('data-url');
        card.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('btn-detail') || target.classList.contains('btn-schedule')) {
                return;
            }
            if (url) goToTrainerPage(url);
        });
    });


    document.querySelectorAll('.btn-detail').forEach((btn: Element) => {
        btn.addEventListener('click', (e: Event) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id') || '0');
            const trainer = trainersData.find(t => (t as any).id === id);
            if (trainer) goToTrainerPage((trainer as any).pageUrl);
        });
    });


    document.querySelectorAll('.btn-schedule').forEach((btn: Element) => {
        btn.addEventListener('click', (e: Event) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id') || '0');
            const trainer = trainersData.find(t => (t as any).id === id);
            if (trainer) showNotification(`📅 расписание тренера ${(trainer as any).name} появится скоро`);
        });
    });
}


function resetFilters(): void {
    const typeFilter = getOptionalElement<HTMLSelectElement>('typeFilter');
    const clubFilter = getOptionalElement<HTMLSelectElement>('clubFilter');
    const specialtyFilter = getOptionalElement<HTMLSelectElement>('specialtyFilter');
    
    if (typeFilter) typeFilter.value = 'all';
    if (clubFilter) clubFilter.value = 'all';
    if (specialtyFilter) specialtyFilter.value = 'all';
    
    renderTrainers();
    showNotification('🔍 фильтры сброшены');
}


function bindEvents(): void {
    const typeFilter = getOptionalElement<HTMLSelectElement>('typeFilter');
    const clubFilter = getOptionalElement<HTMLSelectElement>('clubFilter');
    const specialtyFilter = getOptionalElement<HTMLSelectElement>('specialtyFilter');
    const resetBtn = getOptionalElement<HTMLButtonElement>('resetFilters');
    
    typeFilter?.addEventListener('change', renderTrainers);
    clubFilter?.addEventListener('change', renderTrainers);
    specialtyFilter?.addEventListener('change', renderTrainers);
    resetBtn?.addEventListener('click', resetFilters);
}


function initModal(): void {
    const modal = getOptionalElement<HTMLElement>('auth-modal');
    const closeBtn = getOptionalElement<HTMLElement>('modalCloseBtn');
    const loginBtn = getOptionalElement<HTMLElement>('loginBtn');
    const loginTab = document.querySelector('[data-tab="login"]');
    const registerTab = document.querySelector('[data-tab="register"]');
    const loginForm = getOptionalElement<HTMLElement>('login-form');
    const registerForm = getOptionalElement<HTMLElement>('register-form');
    const switchToRegister = getOptionalElement<HTMLElement>('switch-to-register');
    const switchToLogin = getOptionalElement<HTMLElement>('switch-to-login');
    const loginSubmit = getOptionalElement<HTMLElement>('login-submit-btn');
    const registerSubmit = getOptionalElement<HTMLElement>('register-submit-btn');

    function closeModal(): void {
        modal?.classList.remove('active');
    }

    function openModal(): void {
        modal?.classList.add('active');
    }

    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e: Event) => {
        if (e.target === modal) closeModal();
    });
    loginBtn?.addEventListener('click', openModal);

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


    loginSubmit?.addEventListener('click', () => {
        const email = (getOptionalElement<HTMLInputElement>('login-email'))?.value;
        const password = (getOptionalElement<HTMLInputElement>('login-password'))?.value;
        
        if (!email || !password) {
            showNotification('пожалуйста, заполните все поля', true);
            return;
        }
        
        if (window.authAPI) {
            const result = window.authAPI.login(email, password);
            if (result.success) {
                showNotification(result.message);
                closeModal();
                const currentUser = window.authAPI.getCurrentUser();
                if (currentUser && loginBtn) {
                    loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
                }
            } else {
                showNotification(result.message, true);
            }
        } else {
            showNotification(`✨ добро пожаловать, ${email.split('@')[0]}! ✨`);
            closeModal();
        }
        
        const loginEmail = getOptionalElement<HTMLInputElement>('login-email');
        const loginPassword = getOptionalElement<HTMLInputElement>('login-password');
        if (loginEmail) loginEmail.value = '';
        if (loginPassword) loginPassword.value = '';
    });


    registerSubmit?.addEventListener('click', () => {
        const name = (getOptionalElement<HTMLInputElement>('register-name'))?.value;
        const email = (getOptionalElement<HTMLInputElement>('register-email'))?.value;
        const phone = (getOptionalElement<HTMLInputElement>('register-phone'))?.value;
        const password = (getOptionalElement<HTMLInputElement>('register-password'))?.value;
        
        if (!name || !email || !password) {
            showNotification('пожалуйста, заполните имя, email и пароль', true);
            return;
        }
        
        if (password.length < 4) {
            showNotification('пароль должен быть не менее 4 символов', true);
            return;
        }
        
        if (window.authAPI) {
            const result = window.authAPI.register(name, email, phone, password);
            if (result.success) {
                showNotification(result.message);
                closeModal();
                const currentUser = window.authAPI.getCurrentUser();
                if (currentUser && loginBtn) {
                    loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
                }
            } else {
                showNotification(result.message, true);
            }
        } else {
            showNotification(`✨ ${name}, добро пожаловать в точку баланса! ✨`);
            closeModal();
        }
        
        const regName = getOptionalElement<HTMLInputElement>('register-name');
        const regEmail = getOptionalElement<HTMLInputElement>('register-email');
        const regPhone = getOptionalElement<HTMLInputElement>('register-phone');
        const regPassword = getOptionalElement<HTMLInputElement>('register-password');
        if (regName) regName.value = '';
        if (regEmail) regEmail.value = '';
        if (regPhone) regPhone.value = '';
        if (regPassword) regPassword.value = '';
    });
}


function checkAuthOnLoad(): void {
    const loginBtn = getOptionalElement<HTMLElement>('loginBtn');
    if (window.authAPI && window.authAPI.isLoggedIn()) {
        const currentUser = window.authAPI.getCurrentUser();
        if (currentUser && loginBtn) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        }
    }
}


function initSubscription(): void {
    const subscribeBtns = document.querySelectorAll('.footer-col .btn-primary');
    subscribeBtns.forEach((btn: Element) => {
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


function init(): void {
    renderTrainers();
    bindEvents();
    initModal();
    initSubscription();
    initStickyHeader();
    checkAuthOnLoad();
}


document.addEventListener('DOMContentLoaded', init);
function updateLoginButton() {
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return;
    
    if (window.authAPI && window.authAPI.isLoggedIn()) {
        const user = window.authAPI.getCurrentUser();
        if (user) {
            loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${user.name}`;
            loginBtn.onclick = () => { window.location.href = '../кабинет/Кабинетhtml.html'; };
        }
    } else {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> войти`;
        loginBtn.onclick = () => { openModal(); };
    }
}


updateLoginButton();
