
import { UserDatabase } from './authDb.js';

const userDB = new UserDatabase();

document.addEventListener('DOMContentLoaded', async () => {
    await userDB.init();

    const regBtn = document.querySelector('.svitchBtn');
    const loginBtn = document.querySelector('.switchBtn');
    const regForm = document.querySelector('.registrationForm');
    const loginForm = document.querySelector('.loginForm');

    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        window.location.href = 'profile.html';
        return;
    }

    function showRegistration() {
        regForm.classList.add('active');
        loginForm.classList.remove('active');
        regBtn.classList.add('sctive');
        loginBtn.classList.remove('active');
        
        const slider = document.querySelector('.switchSlider');
        slider.classList.remove('login');
        slider.classList.add('register');
    }

    function showLogin() {
        loginForm.classList.add('active');
        regForm.classList.remove('active');
        loginBtn.classList.add('active');
        regBtn.classList.remove('sctive');
        
        const slider = document.querySelector('.switchSlider');
        slider.classList.remove('register');
        slider.classList.add('login');
    }

    regBtn?.addEventListener('click', showRegistration);
    loginBtn?.addEventListener('click', showLogin);
    showRegistration();

    regForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = regForm.querySelector('input[placeholder="Имя"]').value;
        const phone = regForm.querySelector('input[placeholder="Номер телефона"]').value;
        const password = regForm.querySelector('input[placeholder="Пароль"]').value;
        
        if (!name || !phone || !password) {
            alert('Заполните все поля');
            return;
        }
        
        try {
            const result = await userDB.addUser({ name, phoneNumber: phone, password });
            alert(result);
            // После регистрации сразу авторизуем
            const loginResult = await userDB.loginUser(phone, password);
            if (loginResult.success) {
                sessionStorage.setItem('currentUser', JSON.stringify(loginResult.user));
                window.location.href = 'profile.html';
            }
        } catch (error) {
            alert(error);
        }
    });

    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phone = loginForm.querySelector('input[placeholder="Номер телефона"]').value;
        const password = loginForm.querySelector('input[placeholder="Пароль"]').value;
        
        const result = await userDB.loginUser(phone, password);
        if (result.success) {
            sessionStorage.setItem('currentUser', JSON.stringify(result.user));
            window.location.href = 'profile.html';
        } else {
            alert(result.message);
        }
    });
});

const promoBtn1 = document.getElementById('btn1');
const promoBtn2 = document.getElementById('btn2');
const promoBtn3 = document.getElementById('btn3');

if (promoBtn1) {
    promoBtn1.addEventListener('click', () => {
        window.location.href = 'registration.html';
    });
}

if (promoBtn2) {
    promoBtn2.addEventListener('click', () => {
        window.location.href = 'catalog.html';
        sessionStorage.setItem('freeDelivery', 'true');
    });
}

if (promoBtn3) {
    promoBtn3.addEventListener('click', () => {
        window.location.href = 'catalog.html';
        sessionStorage.setItem('specialSet', 'true');
    });
}

const freeDelivery = sessionStorage.getItem('freeDelivery');
if (freeDelivery === 'true' && window.location.pathname.includes('catalog.html')) {
    setTimeout(() => {
        alert('Акция! При заказе от 1000 рублей доставка бесплатная!');
    }, 500);
    sessionStorage.removeItem('freeDelivery');
}

const specialSet = sessionStorage.getItem('specialSet');
if (specialSet === 'true' && window.location.pathname.includes('catalog.html')) {
    setTimeout(() => {
        alert('Акция! При заказе Кислых червячков, Лимонных долек и Зеленого яблока цена всего 450 ₽!');
    }, 500);
    sessionStorage.removeItem('specialSet');
}