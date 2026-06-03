import { CartDatabase } from './cartDb.js';
import { UserDatabase } from './authDb.js';

const cartDB = new CartDatabase();
const userDB = new UserDatabase();

await cartDB.init();
await userDB.init();

const currentUser = sessionStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = 'registration.html';
}

let user = JSON.parse(currentUser);
let isEditing = false;

document.getElementById('userName').textContent = user.name;
document.getElementById('nameDisplay').textContent = user.name;
document.getElementById('phoneDisplay').textContent = user.phoneNumber;

const discountElement = document.getElementById('userDiscount');
if (discountElement && user.discount !== undefined) {
    discountElement.textContent = `Ваша скидка: ${user.discount}%`;
}

function loadAvatar() {
    const avatarImg = document.getElementById('avatarImg');
    if (user.avatar) {
        avatarImg.src = '/img/' + user.avatar;
    } else {
        avatarImg.src = '/img/avatar1.png';
    }
}
loadAvatar();

async function loadOrders() {
    const orders = await cartDB.getOrders(user.phoneNumber);
    const orderList = document.getElementById('orderList');
    
    if (orders.length === 0) {
        orderList.innerHTML = '<div class="empty-orders-wrapper"><p class="empty-orders-text">Все мармеладки съедены</p></div>';
        return;
    }
    
    orderList.innerHTML = orders.map(order => `
        <div style="border:3px solid #FF8081; padding:15px; margin-bottom:15px; border-radius:24px; width: 1500px; color: #2A2316; font-size: 2rem; text-align: start; padding-left: 60px; font-family: 'guidy'; gap: 20px;">
            <p>Дата: ${new Date(order.date).toLocaleString()}</p>
            <p>Адрес: ${order.address}</p>
            <p>Сумма: ${order.total} ₽</p>
            ${order.discountApplied ? `<p>Скидка: ${order.discountApplied}%</p>` : ''}
            ${order.specialOfferApplied ? `<p>Применена акция "Набор за 450 ₽"</p>` : ''}
            <p>Товары:</p>
            <ul>
                ${order.items.map(item => `<li>${item.product.name} x ${item.quantity} = ${item.product.price * item.quantity} ₽</li>`).join('')}
            </ul>
        </div>
    `).join('');
}
loadOrders();

const editBtn = document.getElementById('editProfileBtn');
const nameDisplay = document.getElementById('nameDisplay');
const nameInput = document.getElementById('nameInput');
const passwordDisplay = document.getElementById('passwordDisplay');
const passwordInput = document.getElementById('passwordInput');

editBtn.addEventListener('click', () => {
    if (!isEditing) {
        isEditing = true;
        nameDisplay.style.display = 'none';
        nameInput.style.display = 'inline-block';
        nameInput.value = user.name;
        passwordDisplay.style.display = 'none';
        passwordInput.style.display = 'inline-block';
        passwordInput.value = '';
        editBtn.textContent = 'Сохранить данные';
    } else {
        saveChanges();
    }
});

async function saveChanges() {
    const newName = nameInput.value.trim();
    const newPassword = passwordInput.value.trim();
    
    if (!newName) {
        alert('Имя не может быть пустым');
        return;
    }

    const updatedUser = {
        phoneNumber: user.phoneNumber,
        name: newName,
        password: newPassword || user.password,
        avatar: user.avatar || 'avatar1.png',
        discount: user.discount || 0,
        createdAt: user.createdAt
    };
    
    try {
        const transaction = userDB.db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        const request = store.put(updatedUser);
        
        request.onsuccess = () => {
            user = updatedUser;
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            document.getElementById('userName').textContent = user.name;
            nameDisplay.textContent = user.name;
            if (discountElement && user.discount !== undefined) {
                discountElement.textContent = `Ваша скидка: ${user.discount}%`;
            }
            isEditing = false;
            nameDisplay.style.display = 'inline';
            nameInput.style.display = 'none';
            passwordDisplay.style.display = 'inline';
            passwordInput.style.display = 'none';
            editBtn.textContent = 'Настройки профиля';
        };
        
        request.onerror = () => alert('Ошибка при обновлении данных');
    } catch (error) {
        alert('Ошибка: ' + error);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isEditing) {
        isEditing = false;
        nameDisplay.style.display = 'inline';
        nameInput.style.display = 'none';
        passwordDisplay.style.display = 'inline';
        passwordInput.style.display = 'none';
        editBtn.textContent = 'Настройки профиля';
    }
});

document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('currentUser');
    window.location.href = 'registration.html';
});

const changeAvatarBtn = document.getElementById('changeAvatarBtn');
const avatarModal = document.getElementById('avatarModal');
const closeModal = document.querySelector('.closeModal');

changeAvatarBtn.addEventListener('click', () => {
    avatarModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    avatarModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === avatarModal) {
        avatarModal.style.display = 'none';
    }
});

window.selectAvatar = function(avatarFile) {
    console.log('selectAvatar вызвана с:', avatarFile);
    document.getElementById('avatarImg').src = '/img/' + avatarFile;
    document.getElementById('avatarModal').style.display = 'none';
    
    const updatedUser = { ...user, avatar: avatarFile };
    
    try {
        const transaction = userDB.db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        const request = store.put(updatedUser);
        
        request.onsuccess = () => {
            user = updatedUser;
            sessionStorage.setItem('currentUser', JSON.stringify(user));
        };
        
        request.onerror = () => {
            alert('Ошибка при сохранении');
        };
    } catch(error) {
        console.error('Ошибка:', error);
    }
};