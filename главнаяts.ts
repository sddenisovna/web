export {};





console.log('✅ главнаяts.ts загружен');


interface Training {
    id: number;
    title: string;
    trainer: string;
    district: string;
    rating: number;
    reviews: number;
    image: string;
}

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


const popularTrainings: Training[] = [
    { id: 1, title: 'йога для начинающих', trainer: 'Анжелика Джоли', district: 'Железнодорожный район', rating: 4.9, reviews: 124, image: 'https://uploads.lebonbon.fr/source/2025/may/2078357/cours-yoga-bordeaux_2_1200.jpg' },
    { id: 2, title: 'реформер пилатес', trainer: 'Александра Йоханссон', district: 'Ленинский район', rating: 4.8, reviews: 89, image: 'https://i.pinimg.com/originals/88/6f/2a/886f2a677879da300539aeadddb44703.jpg' },
    { id: 3, title: 'барре', trainer: 'Маргарита Робби', district: 'Самарский район', rating: 5.0, reviews: 156, image: 'https://hollywoodlife.com/wp-content/uploads/2022/04/barre-and-pilates-ball-hl.jpg?fit=1000%2C990' },
    { id: 4, title: 'стрейчинг', trainer: 'Софья Суини', district: 'Советский район', rating: 4.9, reviews: 203, image: 'https://www.bien.hu/wp-content/uploads/2024/01/iStock-1129153171-scaled.jpg' },
    { id: 5, title: 'горячая йога', trainer: 'Анжелика Джоли', district: 'Железнодорожный район', rating: 5.0, reviews: 67, image: 'https://i.pinimg.com/736x/cd/f1/fb/cdf1fb5f3aa7b4854a1292f3be960720.jpg' },
    { id: 6, title: 'горячий пилатес', trainer: 'Карина Кардашьян', district: 'Самарский район', rating: 5.0, reviews: 169, image: 'https://avatars.mds.yandex.net/i?id=0a6b51814635907a4d7d0296cbfc81d5_l-5575009-images-thumbs&n=13' }
];


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


let selectedTraining: Training | null = null;


function bookTraining(training: Training): void {
    selectedTraining = training;
    
    if (window.authAPI && window.authAPI.isLoggedIn()) {
        showNotification(`✨ Вы записаны на "${training.title}"! ✨`);
        selectedTraining = null;
    } else {

        const infoBlock = getElement('modalTrainingInfo');
        if (infoBlock) {
            infoBlock.style.display = 'block';
            infoBlock.innerHTML = `
                <p><strong>📋 вы записываетесь на:</strong></p>
                <p><strong>${training.title}</strong></p>
                <p>👤 тренер: ${training.trainer}</p>
                <p>📍 ${training.district}</p>
                <p>для записи войдите или зарегистрируйтесь</p>
            `;
        }
        openModal();
    }
}


function initBookButtons(): void {
    const bookBtns = document.querySelectorAll('.card-btn');
    console.log('🔍 Найдено кнопок записи:', bookBtns.length);
    
    bookBtns.forEach((btn, index) => {

        const newBtn = btn.cloneNode(true);
        btn.parentNode?.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const training = popularTrainings[index];
            if (training) {
                bookTraining(training);
            } else {

                const card = (newBtn as HTMLElement).closest('.popular-card');
                const title = card?.querySelector('h3')?.textContent || 'занятие';
                const trainer = card?.querySelector('.trainer-name')?.textContent || 'тренер';
                const location = card?.querySelector('.location')?.textContent?.replace(/[^а-яА-Я\s]/g, '') || 'район';
                bookTraining({
                    id: Date.now(),
                    title: title,
                    trainer: trainer,
                    district: location,
                    rating: 0,
                    reviews: 0,
                    image: ''
                });
            }
        });
    });
}


function scrollToContent(): void {
    const content = document.querySelector('.content-wrapper');
    if (content) {
        content.scrollIntoView({ behavior: 'smooth' });
    }
}

(window as any).scrollToContent = scrollToContent;


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
    const loginHeaderBtn = getElement('loginBtn');
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
        selectedTraining = null;
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


    loginSubmit?.addEventListener('click', () => {
        const email = (getElement<HTMLInputElement>('login-email'))?.value || '';
        const password = (getElement<HTMLInputElement>('login-password'))?.value || '';
        
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
                if (currentUser && loginHeaderBtn) {
                    loginHeaderBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
                }
                if (selectedTraining) {
                    showNotification(`✨ Вы записаны на "${selectedTraining.title}"! ✨`);
                    selectedTraining = null;
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
            if (selectedTraining) {
                showNotification(`✨ Вы записаны на "${selectedTraining.title}"! ✨`);
                selectedTraining = null;
            }
            const loginEmail = getElement<HTMLInputElement>('login-email');
            const loginPassword = getElement<HTMLInputElement>('login-password');
            if (loginEmail) loginEmail.value = '';
            if (loginPassword) loginPassword.value = '';
        }
    });


    registerSubmit?.addEventListener('click', () => {
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
            const result = window.authAPI.register(name, email, phone, password);
            if (result.success) {
                showNotification(result.message);
                closeModal();
                const currentUser = window.authAPI.getCurrentUser();
                if (currentUser && loginHeaderBtn) {
                    loginHeaderBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
                }
                if (selectedTraining) {
                    showNotification(`✨ Вы записаны на "${selectedTraining.title}"! ✨`);
                    selectedTraining = null;
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
            if (selectedTraining) {
                showNotification(`✨ Вы записаны на "${selectedTraining.title}"! ✨`);
                selectedTraining = null;
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


function checkAuthOnLoad(): void {
    const loginBtn = getElement('loginBtn');
    if (window.authAPI && window.authAPI.isLoggedIn()) {
        const currentUser = window.authAPI.getCurrentUser();
        if (currentUser && loginBtn) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        }
    }
}


function initCardsAnimation(): void {
    const cards = document.querySelectorAll('.promo-card, .feature-card, .popular-card, .step');
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


function init(): void {
    console.log('🚀 init() вызван');
    initBookButtons();
    initModal();
    initSubscription();
    initStickyHeader();
    checkAuthOnLoad();
    initCardsAnimation();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
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
