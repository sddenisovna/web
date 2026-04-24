export {};





console.log('✅ блогts.ts загружен');


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


function getBlogElement<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}

function showBlogNotification(message: string, isError: boolean = false): void {
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


function initBlogSubscription(): void {
    const subscribeBtns = document.querySelectorAll('.footer-col .btn-primary');
    subscribeBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.footer-col');
            const input = parent?.querySelector('input[type="email"]') as HTMLInputElement;
            if (input && input.value) {
                showBlogNotification(`💌 спасибо за подписку! письма будут приходить на ${input.value}`);
                input.value = '';
            } else {
                showBlogNotification('пожалуйста, введите e-mail', true);
            }
        });
    });
}


function initBlogArticleLinks(): void {
    const readMoreLinks = document.querySelectorAll('.read-more');
    readMoreLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const articleTitle = link.closest('article')?.querySelector('h2, h3')?.textContent || 'статья';
            showBlogNotification(`📖 статья "${articleTitle}" — скоро будет доступна для чтения!`);
        });
    });
}


function initBlogTagLinks(): void {
    const tags = document.querySelectorAll('.tags-list a');
    tags.forEach((tag) => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            const tagName = tag.textContent || '';
            showBlogNotification(`🔍 показываем статьи по тегу ${tagName}`);
        });
    });
}


function initBlogAlsoReadLinks(): void {
    const alsoReadItems = document.querySelectorAll('.also-read-item');
    alsoReadItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const title = item.querySelector('span')?.textContent || 'статья';
            showBlogNotification(`📖 открыть статью "${title}"`);
        });
    });
}


function initBlogMagazineLink(): void {
    const magazineLink = document.querySelector('.magazine-link');
    if (magazineLink) {
        magazineLink.addEventListener('click', () => {
            console.log('Переход на журнал theGirl');
        });
    }
}


let blogSelectedAction: string | null = null;

function openBlogModal(): void {
    const modal = getBlogElement('auth-modal');
    if (modal) modal.classList.add('active');
}

function closeBlogModal(): void {
    const modal = getBlogElement('auth-modal');
    if (modal) modal.classList.remove('active');
}

function initBlogModal(): void {
    const modal = getBlogElement('auth-modal');
    const closeBtn = getBlogElement('modalCloseBtn');
    const loginHeaderBtn = document.querySelector('.header .btn-outline') as HTMLElement;
    const loginTab = document.querySelector('[data-tab="login"]');
    const registerTab = document.querySelector('[data-tab="register"]');
    const loginForm = getBlogElement('login-form');
    const registerForm = getBlogElement('register-form');
    const switchToRegister = getBlogElement('switch-to-register');
    const switchToLogin = getBlogElement('switch-to-login');
    const loginSubmit = getBlogElement('login-submit-btn');
    const registerSubmit = getBlogElement('register-submit-btn');

    closeBtn?.addEventListener('click', closeBlogModal);
    
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeBlogModal();
    });
    
    loginHeaderBtn?.addEventListener('click', () => {
        blogSelectedAction = null;
        openBlogModal();
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
        const email = (getBlogElement<HTMLInputElement>('login-email'))?.value || '';
        const password = (getBlogElement<HTMLInputElement>('login-password'))?.value || '';
        
        if (!email || !password) {
            showBlogNotification('пожалуйста, заполните все поля', true);
            return;
        }
        
        if (window.authAPI) {
            const result = await window.authAPI.login(email, password);
            if (result.success) {
                showBlogNotification(result.message);
                closeBlogModal();
                updateBlogLoginButton();
                const loginEmail = getBlogElement<HTMLInputElement>('login-email');
                const loginPassword = getBlogElement<HTMLInputElement>('login-password');
                if (loginEmail) loginEmail.value = '';
                if (loginPassword) loginPassword.value = '';
            } else {
                showBlogNotification(result.message, true);
            }
        } else {
            showBlogNotification(`✨ добро пожаловать, ${email.split('@')[0]}! ✨`);
            closeBlogModal();
            updateBlogLoginButton();
            const loginEmail = getBlogElement<HTMLInputElement>('login-email');
            const loginPassword = getBlogElement<HTMLInputElement>('login-password');
            if (loginEmail) loginEmail.value = '';
            if (loginPassword) loginPassword.value = '';
        }
    });


    registerSubmit?.addEventListener('click', async () => {
        const name = (getBlogElement<HTMLInputElement>('register-name'))?.value || '';
        const email = (getBlogElement<HTMLInputElement>('register-email'))?.value || '';
        const phone = (getBlogElement<HTMLInputElement>('register-phone'))?.value || '';
        const password = (getBlogElement<HTMLInputElement>('register-password'))?.value || '';
        
        if (!name || !email || !password) {
            showBlogNotification('пожалуйста, заполните имя, email и пароль', true);
            return;
        }
        
        if (password.length < 4) {
            showBlogNotification('пароль должен быть не менее 4 символов', true);
            return;
        }
        
        if (window.authAPI) {
            const result = await window.authAPI.register(name, email, phone, password);
            if (result.success) {
                showBlogNotification(result.message);
                closeBlogModal();
                updateBlogLoginButton();
                const regName = getBlogElement<HTMLInputElement>('register-name');
                const regEmail = getBlogElement<HTMLInputElement>('register-email');
                const regPhone = getBlogElement<HTMLInputElement>('register-phone');
                const regPassword = getBlogElement<HTMLInputElement>('register-password');
                if (regName) regName.value = '';
                if (regEmail) regEmail.value = '';
                if (regPhone) regPhone.value = '';
                if (regPassword) regPassword.value = '';
            } else {
                showBlogNotification(result.message, true);
            }
        } else {
            showBlogNotification(`✨ ${name}, добро пожаловать в точку баланса! ✨`);
            closeBlogModal();
            updateBlogLoginButton();
            const regName = getBlogElement<HTMLInputElement>('register-name');
            const regEmail = getBlogElement<HTMLInputElement>('register-email');
            const regPhone = getBlogElement<HTMLInputElement>('register-phone');
            const regPassword = getBlogElement<HTMLInputElement>('register-password');
            if (regName) regName.value = '';
            if (regEmail) regEmail.value = '';
            if (regPhone) regPhone.value = '';
            if (regPassword) regPassword.value = '';
        }
    });
}


function updateBlogLoginButton(): void {
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
        loginBtn.onclick = () => openBlogModal();
    }
}


function initBlogStickyHeader(): void {
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


function initBlogScrollAnimation(): void {
    const animatedElements = document.querySelectorAll('.featured-post, .post-card, .news-column, .magazine-card, .tags-cloud, .also-read-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                (entry.target as HTMLElement).style.opacity = '1';
                (entry.target as HTMLElement).style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    animatedElements.forEach((element) => {
        (element as HTMLElement).style.opacity = '0';
        (element as HTMLElement).style.transform = 'translateY(20px)';
        (element as HTMLElement).style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
}


function initBlog(): void {
    console.log('🚀 Блог загружен');
    initBlogSubscription();
    initBlogArticleLinks();
    initBlogTagLinks();
    initBlogAlsoReadLinks();
    initBlogMagazineLink();
    initBlogModal();
    initBlogStickyHeader();
    updateBlogLoginButton();
    initBlogScrollAnimation();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlog);
} else {
    initBlog();
}
