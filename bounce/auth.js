
import { UserDatabase } from './authDb.js';

const userDB = new UserDatabase();

document.addEventListener('DOMContentLoaded', async () => {

    await userDB.init();

    const regBtn = document.querySelector('.svitchBtn');
    const loginBtn = document.querySelector('.switchBtn');
    const regForm = document.querySelector('.registrationForm');
    const loginForm = document.querySelector('.loginForm');

    function showRegistration() {
        regForm.classList.add('active');
        loginForm.classList.remove('active');
    }

    function showLogin() {
        loginForm.classList.add('active');
        regForm.classList.remove('active');
    }

    regBtn?.addEventListener('click', showRegistration);
    loginBtn?.addEventListener('click', showLogin);
    showRegistration();

    regForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = regForm.querySelector('input[placeholder="Имя"]').value;
        const phone = regForm.querySelector('input[placeholder="Номер телефона"]').value;
        const password = regForm.querySelector('input[placeholder="Пароль"]').value;
        
        try {
            const result = await userDB.addUser({ name, phoneNumber: phone, password });
            alert(result);
            regForm.reset();
        } catch (error) {
            alert(error);
        }
    });

    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phone = loginForm.querySelector('input[placeholder="Номер телефона"]').value;
        const password = loginForm.querySelector('input[placeholder="Пароль"]').value;
        
        const result = await userDB.loginUser(phone, password);
        alert(result.message);
        if (result.success) loginForm.reset();
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const regBtn = document.querySelector('.svitchBtn');
    const loginBtn = document.querySelector('.switchBtn');
    const regForm = document.querySelector('.registrationForm');
    const loginForm = document.querySelector('.loginForm');
    const slider = document.querySelector('.switchSlider');

    function showRegistration() {
        regForm.classList.add('active');
        loginForm.classList.remove('active');

        regBtn.classList.add('sctive');
        loginBtn.classList.remove('active');
        
        slider.classList.remove('login');
        slider.classList.add('register');
    }

    function showLogin() {

        loginForm.classList.add('active');
        regForm.classList.remove('active');

        loginBtn.classList.add('active');
        regBtn.classList.remove('sctive');

        slider.classList.remove('register');
        slider.classList.add('login');
    }

    regBtn.addEventListener('click', showRegistration);
    loginBtn.addEventListener('click', showLogin);

    showRegistration();
});