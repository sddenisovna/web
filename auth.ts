

const API_URL = 'http://localhost:3000';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    registeredAt: string;
}


async function registerUser(name: string, email: string, phone: string, password: string) {
    try {
        const checkResponse = await fetch(`${API_URL}/users?email=${email}`);
        const existing = await checkResponse.json();
        
        if (existing.length > 0) {
            return { success: false, message: 'email уже зарегистрирован' };
        }
        
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                phone,
                password,
                registeredAt: new Date().toLocaleString('ru-RU')
            })
        });
        
        const user = await response.json();
        

        const userToSave = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            registeredAt: user.registeredAt
        };
        localStorage.setItem('tochka_balance_current_user', JSON.stringify(userToSave));
        
        console.log('✅ Зарегистрирован и сохранён:', userToSave);
        
        return { success: true, message: `✨ ${name}, добро пожаловать! ✨`, user: userToSave };
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        return { success: false, message: 'ошибка соединения с сервером' };
    }
}


async function loginUser(email: string, password: string) {
    try {
        const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
        const users = await response.json();
        
        if (users.length === 0) {
            return { success: false, message: 'неверный email или пароль' };
        }
        
        const user = users[0];
        

        const userToSave = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            registeredAt: user.registeredAt
        };
        localStorage.setItem('tochka_balance_current_user', JSON.stringify(userToSave));
        
        console.log('✅ Вход выполнен, сохранён:', userToSave);
        
        return { success: true, message: `✨ добро пожаловать, ${user.name}! ✨`, user: userToSave };
    } catch (error) {
        console.error('Ошибка входа:', error);
        return { success: false, message: 'ошибка соединения с сервером' };
    }
}


function getCurrentUser() {
    const data = localStorage.getItem('tochka_balance_current_user');
    console.log('📦 getCurrentUser из localStorage:', data);
    return data ? JSON.parse(data) : null;
}


function isLoggedIn() {
    const user = getCurrentUser();
    return user !== null;
}


function logout() {
    localStorage.removeItem('tochka_balance_current_user');
    console.log('👋 Пользователь вышел');
}


(window as any).authAPI = {
    register: registerUser,
    login: loginUser,
    getCurrentUser,
    isLoggedIn,
    logout
};

console.log('🔐 Auth system ready with JSON Server!');
