export {};





console.log('✅ каталогts.ts загружен');


interface Training {
    id: number;
    title: string;
    trainer: string;
    district: string;
    address: string;
    time: string;
    rating: number;
    reviews: number;
    spots: number;
    sport: string;
    level: string;
    format: string;
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


const trainingsData: Training[] = [
    {
        id: 1,
        title: 'йога для начинающих',
        trainer: 'Анжелика Джоли',
        district: 'Железнодорожный',
        address: 'ул. Ленинская, 45',
        time: 'Ср 15:00',
        rating: 5.0,
        reviews: 156,
        spots: 3,
        sport: 'йога',
        level: 'новичок',
        format: 'разовое',
        image: 'https://uploads.lebonbon.fr/source/2025/may/2078357/cours-yoga-bordeaux_2_1200.jpg'
    },
    {
        id: 2,
        title: 'реформер пилатес',
        trainer: 'Александра Йоханссон',
        district: 'Ленинский',
        address: 'пр. Ленина, 120',
        time: 'Пн-Пт 07:00',
        rating: 4.9,
        reviews: 203,
        spots: 6,
        sport: 'пилатес',
        level: 'продвинутый',
        format: 'абонемент',
        image: 'https://i.pinimg.com/originals/88/6f/2a/886f2a677879da300539aeadddb44703.jpg'
    },
    {
        id: 3,
        title: 'барре',
        trainer: 'Карина Кардашьян',
        district: 'Самарский',
        address: 'ул. Полевая, 18',
        time: 'Вт Чт 18:00',
        rating: 5.0,
        reviews: 156,
        spots: 8,
        sport: 'танцы',
        level: 'новичок',
        format: 'разовое',
        image: 'https://hollywoodlife.com/wp-content/uploads/2022/04/barre-and-pilates-ball-hl.jpg?fit=1000%2C990'
    },
    {
        id: 4,
        title: 'стрейчинг',
        trainer: 'Софья Суини',
        district: 'Советский',
        address: 'ул. Ново-Садовая, 56',
        time: 'Пн Ср Пт 09:00',
        rating: 4.9,
        reviews: 203,
        spots: 4,
        sport: 'стрейчинг',
        level: 'любой',
        format: 'абонемент',
        image: 'https://www.bien.hu/wp-content/uploads/2024/01/iStock-1129153171-scaled.jpg'
    },
    {
        id: 5,
        title: 'горячая йога',
        trainer: 'Анжелика Джоли',
        district: 'Железнодорожный',
        address: 'ул. Ленинская, 45',
        time: 'Пт 15:00',
        rating: 5.0,
        reviews: 67,
        spots: 7,
        sport: 'йога',
        level: 'продвинутый',
        format: 'разовое',
        image: 'https://i.pinimg.com/736x/cd/f1/fb/cdf1fb5f3aa7b4854a1292f3be960720.jpg'
    },
    {
        id: 6,
        title: 'горячий пилатес',
        trainer: 'Карина Кардашьян',
        district: 'Самарский',
        address: 'ул. Полевая, 18',
        time: 'Пн Вт Чт Сб Вс 17:00',
        rating: 5.0,
        reviews: 169,
        spots: 1,
        sport: 'пилатес',
        level: 'любой',
        format: 'абонемент',
        image: 'https://avatars.mds.yandex.net/i?id=0a6b51814635907a4d7d0296cbfc81d5_l-5575009-images-thumbs&n=13'
    },
    {
        id: 7,
        title: 'индивидуальные занятия с тренером',
        trainer: 'Софья Суини',
        district: 'любой',
        address: 'по договоренности',
        time: 'индивидуально',
        rating: 5.0,
        reviews: 169,
        spots: 20,
        sport: 'силовые',
        level: 'любой',
        format: 'абонемент',
        image: 'https://i.pinimg.com/736x/68/78/3d/68783dc8c4ca550b314228af78b32c75.jpg'
    }
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


function getCurrentUserId(): string | null {
    const user = localStorage.getItem('tochka_balance_current_user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            return userData.id || userData.email;
        } catch(e) {
            console.error('Ошибка парсинга пользователя:', e);
        }
    }
    return null;
}


function goToCabinet(): void {
    window.location.href = '../кабинет/Кабинетhtml.html';
}


function updateLoginButton(): void {
    const loginBtn = getElement('loginBtn');
    if (!loginBtn) return;
    
    if (window.authAPI && window.authAPI.isLoggedIn()) {
        const currentUser = window.authAPI.getCurrentUser();
        if (currentUser) {
            loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser.name}`;
            loginBtn.onclick = () => {
                window.location.href = '../кабинет/Кабинетhtml.html';
            };
        }
    } else {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> войти`;
        loginBtn.onclick = () => openModal();
    }
}


function addTrainingToCabinet(training: Training): void {
    const userId = getCurrentUserId();
    
    if (!userId) {
        showNotification('ошибка: пользователь не найден', true);
        return;
    }
    
    const trainingData = {
        id: training.id,
        title: training.title,
        trainer: training.trainer,
        time: training.time,
        district: training.district,
        address: training.address
    };
    
    const storageKey = `myTrainings_${userId}`;
    const existing = localStorage.getItem(storageKey);
    let trainings: any[] = existing ? JSON.parse(existing) : [];
    

    const exists = trainings.some((t: any) => t.id === training.id);
    if (!exists) {
        trainings.push(trainingData);
        localStorage.setItem(storageKey, JSON.stringify(trainings));
        showNotification(`✨ Вы записаны на "${training.title}"! ✨`);
    } else {
        showNotification(`⚠️ Вы уже записаны на "${training.title}"`, true);
    }
}


let selectedTraining: Training | null = null;

function bookTraining(training: Training): void {
    selectedTraining = training;
    
    if (window.authAPI && window.authAPI.isLoggedIn()) {
        addTrainingToCabinet(training);
    } else {
        const infoBlock = getElement('modalTrainingInfo');
        if (infoBlock) {
            infoBlock.style.display = 'block';
            infoBlock.innerHTML = `
                <p><strong>📋 вы записываетесь на:</strong></p>
                <p><strong>${training.title}</strong></p>
                <p>👤 тренер: ${training.trainer}</p>
                <p>📍 ${training.district} район, ${training.address}</p>
                <p>⏰ ${training.time}</p>
                <p>для записи войдите или зарегистрируйтесь</p>
            `;
        }
        openModal();
    }
}


function renderTrainings(): void {
    const container = getElement('trainings-container');
    if (!container) {
        console.error('❌ Контейнер #trainings-container не найден');
        return;
    }

    const searchTerm = (getElement<HTMLInputElement>('searchInput')?.value || '').toLowerCase();
    const sport = (getElement<HTMLSelectElement>('sportFilter')?.value || '');
    const district = (getElement<HTMLSelectElement>('districtFilter')?.value || '');
    const format = (getElement<HTMLSelectElement>('formatFilter')?.value || '');
    const level = (getElement<HTMLSelectElement>('levelFilter')?.value || '');

    const filtered = trainingsData.filter(t => {
        if (searchTerm && !t.title.toLowerCase().includes(searchTerm) && !t.trainer.toLowerCase().includes(searchTerm)) return false;
        if (sport && t.sport !== sport) return false;
        if (district && t.district !== district) return false;
        if (format && t.format !== format) return false;
        if (level && level !== 'любой' && t.level !== level) return false;
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-message"><i class="fas fa-heart-broken"></i><p>😔 ничего не найдено</p><p style="font-size: 0.85rem; margin-top: 8px;">попробуйте изменить параметры поиска</p></div>';
        return;
    }

    container.innerHTML = filtered.map(t => `
        <div class="training-card" data-id="${t.id}">
            <div class="card-image">
                <img src="${t.image}" alt="${t.title}" loading="lazy">
            </div>
            <div class="card-info">
                <h3>${t.title}</h3>
                <div class="trainer-name">${t.trainer}</div>
                <div class="location-info">
                    <i class="fas fa-location-dot"></i> ${t.district} район, ${t.address}
                </div>
                <div class="time-info"><i class="far fa-clock"></i> ${t.time}</div>
                <div class="rating-info">
                    <span class="rating"><i class="fas fa-star"></i> ${t.rating} (${t.reviews})</span>
                    <span class="spots-left"><i class="fas fa-users"></i> ${t.spots} мест</span>
                </div>
                <button class="book-btn" data-id="${t.id}">записаться</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id') || '0');
            const training = trainingsData.find(t => t.id === id);
            if (training) bookTraining(training);
        });
    });
}


function resetFilters(): void {
    const searchInput = getElement<HTMLInputElement>('searchInput');
    const sportFilter = getElement<HTMLSelectElement>('sportFilter');
    const districtFilter = getElement<HTMLSelectElement>('districtFilter');
    const dateFilter = getElement<HTMLInputElement>('dateFilter');
    const timeFilter = getElement<HTMLSelectElement>('timeFilter');
    const formatFilter = getElement<HTMLSelectElement>('formatFilter');
    const levelFilter = getElement<HTMLSelectElement>('levelFilter');
    
    if (searchInput) searchInput.value = '';
    if (sportFilter) sportFilter.value = '';
    if (districtFilter) districtFilter.value = '';
    if (dateFilter) dateFilter.value = '';
    if (timeFilter) timeFilter.value = '';
    if (formatFilter) formatFilter.value = '';
    if (levelFilter) levelFilter.value = '';
    
    renderTrainings();
    showNotification('🔍 фильтры сброшены');
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
    
    if (loginHeaderBtn) {
        loginHeaderBtn.onclick = () => {
            const infoBlock = getElement('modalTrainingInfo');
            if (infoBlock) infoBlock.style.display = 'none';
            selectedTraining = null;
            openModal();
        };
    }

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
                updateLoginButton();
                
                if (selectedTraining) {
                    addTrainingToCabinet(selectedTraining);
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
            updateLoginButton();
            
            if (selectedTraining) {
                addTrainingToCabinet(selectedTraining);
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
                updateLoginButton();
                
                if (selectedTraining) {
                    addTrainingToCabinet(selectedTraining);
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
            updateLoginButton();
            
            if (selectedTraining) {
                addTrainingToCabinet(selectedTraining);
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
    updateLoginButton();
}


function initFilters(): void {
    const searchInput = getElement<HTMLInputElement>('searchInput');
    const sportFilter = getElement<HTMLSelectElement>('sportFilter');
    const districtFilter = getElement<HTMLSelectElement>('districtFilter');
    const formatFilter = getElement<HTMLSelectElement>('formatFilter');
    const levelFilter = getElement<HTMLSelectElement>('levelFilter');
    const resetBtn = getElement('resetFilters');
    
    searchInput?.addEventListener('input', renderTrainings);
    sportFilter?.addEventListener('change', renderTrainings);
    districtFilter?.addEventListener('change', renderTrainings);
    formatFilter?.addEventListener('change', renderTrainings);
    levelFilter?.addEventListener('change', renderTrainings);
    resetBtn?.addEventListener('click', resetFilters);
}


function init(): void {
    console.log('🚀 init() вызван');
    renderTrainings();
    initFilters();
    initModal();
    initSubscription();
    initStickyHeader();
    checkAuthOnLoad();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
