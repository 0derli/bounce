
import { CartDatabase } from './cartDb.js';

const cartDB = new CartDatabase();
await cartDB.init();

const currentUser = sessionStorage.getItem('currentUser');
const authLink = document.getElementById('authLink');

if (currentUser) {
    authLink.textContent = 'Профиль';
    authLink.href = 'profile.html';
} else {
    authLink.textContent = 'Войти';
    authLink.href = 'registration.html';
}

async function loadCart() {
    const container = document.getElementById('cartContainer');
    
    if (!currentUser) {
        container.innerHTML = `
            <div style="text-align:center; padding:50px; background-color: #FFFFF0; min-height: 60vh;">
                <h1 style="font-family:'aqum'; font-size: 2.5rem; color: #FF4B83; margin-bottom: 50px; margin-top: 120px;">Корзина</h1>
                <p style="font-family:'guidy'; font-size: 2rem; color; #2A2316; margin-bottom: 50px;">Войдите в систему, чтобы просмотреть корзину</p>
                <a href="registration.html" style="display:inline-block; background:#FF4B83; color:white; padding:26px 116px; text-decoration:none; border-radius:24px; font-family: 'aqum'; font-size: 2rem;">Войти</a>
            </div>
        `;
        return;
    }
    
    const user = JSON.parse(currentUser);
    const cartItems = await cartDB.getCart(user.phoneNumber);
    
    if (cartItems.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:50px;">
                <h1>Корзина</h1>
                <p>Ваша корзина пуста</p>
                <a href="catalog.html" style="display:inline-block; background:#ff6b6b; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">В каталог</a>
            </div>
        `;
        return;
    }
    
    let total = 0;
    let itemsHtml = '<h1>Корзина</h1>';
    itemsHtml += '<div style="max-width:800px; margin:0 auto;">';
    
    for (const item of cartItems) {
        const itemTotal = item.product.price * item.quantity;
        total += itemTotal;
        itemsHtml += `
            <div style="display:flex; align-items:center; gap:20px; border-bottom:1px solid #ddd; padding:15px;">
                <img src="${item.product.image}" style="width:80px; height:80px; object-fit:cover;">
                <div style="flex:1">
                    <h3>${item.product.name}</h3>
                    <p>${item.product.price} ₽ x ${item.quantity}</p>
                    <p><strong>${itemTotal} ₽</strong></p>
                </div>
                <button class="remove-btn" data-id="${item.id}" style="background:#ff4444; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer;">Удалить</button>
            </div>
        `;
    }
    
    itemsHtml += `
        <div style="margin-top:30px; padding:20px; background:#f9f9f9; border-radius:10px;">
            <h3>Итого: ${total} ₽</h3>
            <p>Доставка: 200 ₽</p>
            <hr>
            <h3>К оплате: ${total + 200} ₽</h3>
            
            <div style="margin-top:20px;">
                <h4>Данные для доставки</h4>
                <input type="text" id="orderName" placeholder="ФИО" value="${user.name}" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ddd; border-radius:5px;">
                <input type="text" id="orderAddress" placeholder="Адрес" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ddd; border-radius:5px;">
                <input type="tel" id="orderPhone" placeholder="Номер телефона" value="${user.phoneNumber}" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ddd; border-radius:5px;">
                <button id="orderBtn" style="background:#4CAF50; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">Заказать</button>
            </div>
        </div>
    </div>`;
    
    container.innerHTML = itemsHtml;

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id);
            await cartDB.removeFromCart(id);
            loadCart();
        });
    });

    document.getElementById('orderBtn')?.addEventListener('click', async () => {
        const name = document.getElementById('orderName').value;
        const address = document.getElementById('orderAddress').value;
        const phone = document.getElementById('orderPhone').value;
        
        if (!name || !address || !phone) {
            alert('Заполните все поля');
            return;
        }
        
        const orderItems = [];
        for (const item of cartItems) {
            orderItems.push({
                product: item.product,
                quantity: item.quantity
            });
        }
        
        await cartDB.createOrder(user.phoneNumber, {
            items: orderItems,
            total: total + 200,
            address: address,
            name: name,
            phone: phone
        });
        
        await cartDB.clearCart(user.phoneNumber);
        alert('Заказ оформлен!');
        loadCart();
    });
}

loadCart();