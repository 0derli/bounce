document.addEventListener('DOMContentLoaded', () => {
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
});

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