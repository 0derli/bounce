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
            <div style="text-align:center; padding:50px; background-color: #FFFFF0; min-height:70vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <h1 style="font-size: 5rem; font-family: 'aqum'; color: #FF0066; margin: 50px;">Корзина</h1>
                <p style="color: #2A2316; font-family: 'guidy'; font-size: 3rem; margin-bottom: 50px;">Ваша корзина пуста</p>
                <a href="catalog.html" style="display:inline-block; background:#FF4B83; color:white; padding:40px 60px; text-decoration:none; border-radius:24px; font-size: 3rem; font-family: 'guidy';">В каталог</a>
            </div>
        `;
        return;
    }
    
    let total = 0;
    let specialOfferActive = false;
    let hasSourWorms = false;
    let hasLemonSlices = false;
    let hasGreenApple = false;
    
    for (const item of cartItems) {
        const itemTotal = item.product.price * item.quantity;
        total += itemTotal;
        
        if (item.product.name === "Кислые червячки") hasSourWorms = true;
        if (item.product.name === "Лимонные дольки") hasLemonSlices = true;
        if (item.product.name === "Зеленое яблоко") hasGreenApple = true;
    }
    
    if (hasSourWorms && hasLemonSlices && hasGreenApple) {
        specialOfferActive = true;
        total = 450;
    }
    
    let discountAmount = 0;
    if (user.discount && user.discount > 0 && !specialOfferActive) {
        discountAmount = total * (user.discount / 100);
        total = total - discountAmount;
    }
    
    let deliveryPrice = 200;
    if (total >= 1000) {
        deliveryPrice = 0;
    }
    
    let itemsHtml = '<h1></h1>';
    itemsHtml += '<div style="max-width:80%; margin:0 auto; background-color: #FFFFF0">';
    
    for (const item of cartItems) {
        const itemTotal = item.product.price * item.quantity;
        itemsHtml += `
            <div style="display:flex; align-items:center; gap:20px; border-bottom:5px solid #FF8081; padding:15px; margin-top: 50px">
                <img src="${item.product.image}" style="width:200px; object-fit:cover;">
                <div style="flex:1">
                    <h3 style="font-family: 'aqum'; color: #FF0066; font-size: 2rem; margin-bottom: 30px">${item.product.name}</h3>
                    <p style="color: #2A2316; font-family: 'guidy'; font-size: 1.5rem; margin-bottom: 20px">${item.product.price} ₽ x ${item.quantity}</p>
                    <p style="color: #2A2316; font-family: 'guidy'; font-size: 1.8rem"><strong>${itemTotal} ₽</strong></p>
                </div>
                <button class="remove-btn" data-id="${item.id}" style="background:#FF0066; color:white; border:none; padding:30px 50px; border-radius:15px; cursor:pointer; font-size: 1.7rem; font-family: 'aqum'; margin-bottom: 100px">Удалить</button>
            </div>
        `;
    }
    
    let specialOfferHtml = '';
    if (specialOfferActive) {
        specialOfferHtml = `<div style="background:#FF4B83; color:white; padding:15px; border-radius:24px; margin-bottom:20px; text-align:center; font-family:'aqum'; font-size:1.8rem;">🎉 Акция! Набор "Кислые червячки + Лимонные дольки + Зеленое яблоко" = 450 ₽ 🎉</div>`;
    }
    
    let discountHtml = '';
    if (discountAmount > 0 && !specialOfferActive) {
        discountHtml = `<p style="color: #2A2316; font-family: 'guidy'; font-size: 1.8rem; margin-bottom: 15px">Скидка ${user.discount}%: -${Math.round(discountAmount)} ₽</p>`;
    }
    
    let deliveryHtml = '';
    if (deliveryPrice === 0 && !specialOfferActive) {
        deliveryHtml = `<p style="color: #2A2316; font-family: 'guidy'; font-size: 1.8rem; margin-bottom: 15px">Доставка: БЕСПЛАТНО (при заказе от 1000 ₽)</p>`;
    } else if (!specialOfferActive) {
        deliveryHtml = `<p style="color: #2A2316; font-family: 'guidy'; font-size: 1.8rem; margin-bottom: 15px">Доставка: ${deliveryPrice} ₽</p>`;
    } else {
        deliveryHtml = `<p style="color: #2A2316; font-family: 'guidy'; font-size: 1.8rem; margin-bottom: 15px">Доставка: ${deliveryPrice} ₽</p>`;
    }
    
    itemsHtml += `
        <div style="margin-top:30px; padding:20px; background:#FFFFF0; border-radius:24px;">
            ${specialOfferHtml}
            <h3 style="color: #2A2316; font-family: 'guidy'; font-size: 2.5rem; margin-bottom: 30px">Итого: ${Math.round(total)} ₽</h3>
            ${discountHtml}
            ${deliveryHtml}
            <hr style="background-color: #FF8081;">
            <h3 style="color: #2A2316; font-family: 'guidy'; font-size: 2.5rem; margin-bottom: 30px; margin-top: 50px;">К оплате: ${Math.round(total + deliveryPrice)} ₽</h3>
            
            <div style="margin-top:20px;">
                <h4 style="color: #FF0066; font-family: 'guidy'; font-size: 2.5rem; margin-bottom: 50px; margin-top: 100px;">Данные для доставки</h4>
                <input style="border: 5px solid #FF8081; width: 100%; height: 50px; border-radius: 15px; background-color: #FFFFF0; padding-left: 30px; font-size: 2rem; color: #2A2316; font-family: 'guidy'; margin-bottom: 50px" type="text" id="orderName" placeholder="ФИО" value="${user.name}">
                <input type="text" id="orderAddress" placeholder="Адрес" style="border: 5px solid #FF8081; width: 100%; height: 50px; border-radius: 15px; background-color: #FFFFF0; padding-left: 30px; font-size: 2rem; color: #2A2316; font-family: 'guidy'; margin-bottom: 50px">
                <input type="tel" id="orderPhone" placeholder="Номер телефона" value="${user.phoneNumber}" style="border: 5px solid #FF8081; width: 100%; height: 50px; border-radius: 15px; background-color: #FFFFF0; padding-left: 30px; font-size: 2rem; color: #2A2316; font-family: 'guidy'; margin-bottom: 80px">
                <button id="orderBtn" style="background:#FF0066; color:white; border:none; padding:30px 50px; border-radius:15px; cursor:pointer; font-size: 1.7rem; font-family: 'aqum'; margin-bottom: 100px">Заказать</button>
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
        
        let finalTotal = total;
        if (specialOfferActive) {
            finalTotal = 450;
        } else {
            finalTotal = total + deliveryPrice;
        }
        
        await cartDB.createOrder(user.phoneNumber, {
            items: orderItems,
            total: finalTotal,
            address: address,
            name: name,
            phone: phone,
            discountApplied: !specialOfferActive ? user.discount : 0,
            specialOfferApplied: specialOfferActive
        });
        
        await cartDB.clearCart(user.phoneNumber);
        alert('Заказ оформлен!');
        loadCart();
    });
}

loadCart();