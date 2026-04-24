export {};





console.log('✅ faqts.ts загружен');


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


function initEmailButton(): void {
    const emailBtn = document.getElementById('emailBtn');
    if (emailBtn) {
        emailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = 'support@tochkaofbalance.ru';
            navigator.clipboard.writeText(email).then(() => {
                showNotification('📧 email скопирован! support@tochkaofbalance.ru');
            }).catch(() => {
                showNotification('📧 support@tochkaofbalance.ru', true);
            });
        });
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


function initFaqAccordion(): void {
    const details = document.querySelectorAll('.faq-item');
    details.forEach((detail) => {
        detail.addEventListener('toggle', (e) => {
            const target = e.target as HTMLDetailsElement;
            if (target.open) {
                const summary = target.querySelector('summary');
                if (summary) {
                    summary.style.fontWeight = '600';
                }
            } else {
                const summary = target.querySelector('summary');
                if (summary) {
                    summary.style.fontWeight = '500';
                }
            }
        });
    });
}


let selectedAction: string | null = null;

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
        selectedAction = null;
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


function initScrollAnimation(): void {
    const elements = document.querySelectorAll('.faq-category, .contact-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                (entry.target as HTMLElement).style.opacity = '1';
                (entry.target as HTMLElement).style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach((element) => {
        (element as HTMLElement).style.opacity = '0';
        (element as HTMLElement).style.transform = 'translateY(20px)';
        (element as HTMLElement).style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
}


function init(): void {
    console.log('🚀 init() вызван');
    initEmailButton();
    initFaqAccordion();
    initModal();
    initSubscription();
    initStickyHeader();
    updateLoginButton(); // ВАЖНО: обновляем кнопку при загрузке
    initScrollAnimation();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
