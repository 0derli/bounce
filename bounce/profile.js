
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

async function loadOrders() {
    const orders = await cartDB.getOrders(user.phoneNumber);
    const orderList = document.getElementById('orderList');
    
    if (orders.length === 0) {
        orderList.innerHTML = '<p>Все мармеладки съедены</p>';
        return;
    }
    
    orderList.innerHTML = orders.map(order => `
        <div style="border:1px solid #ddd; padding:15px; margin-bottom:15px; border-radius:5px;">
            <p><strong>Дата:</strong> ${new Date(order.date).toLocaleString()}</p>
            <p><strong>Адрес:</strong> ${order.address}</p>
            <p><strong>Сумма:</strong> ${order.total} ₽</p>
            <p><strong>Товары:</strong></p>
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
        password: newPassword || user.password
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

            if (!newPassword) {
                passwordDisplay.textContent = '••••••';
            } else {
                passwordDisplay.textContent = '••••••';
            }

            isEditing = false;
            nameDisplay.style.display = 'inline';
            nameInput.style.display = 'none';
            passwordDisplay.style.display = 'inline';
            passwordInput.style.display = 'none';
            editBtn.textContent = 'Настройки профиля';
            
            alert('Данные успешно обновлены');
        };
        
        request.onerror = () => {
            alert('Ошибка при обновлении данных');
        };
        
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