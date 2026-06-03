
import { ProductDatabase } from './db.js';
import { CartDatabase } from './cartDb.js';

const productDB = new ProductDatabase();
const cartDB = new CartDatabase();

await productDB.init();
await cartDB.init();

const grid = document.querySelector('.products');
const searchInput = document.querySelector("#search");
const filterSelect = document.querySelector("#filter");

function renderProducts(list) {
    grid.innerHTML = '';
    list.forEach(cardProduct => {
        grid.innerHTML += `
        <div class="cardProduct">
            <img src="${cardProduct.image}">
            <div class="cardHeader">
                <h3>${cardProduct.name}</h3>
                <span>${cardProduct.price}</span>
            </div>
            <p>${cardProduct.weight}</p>
            <button class="cardBtn" data-id="${cardProduct.id}" data-name="${cardProduct.name}" data-price="${cardProduct.price}" data-image="${cardProduct.image}">В корзину</button>
        </div>
        `;
    });

    document.querySelectorAll('.cardBtn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const currentUser = sessionStorage.getItem('currentUser');
            if (!currentUser) {
                alert('Сначала войдите в систему');
                window.location.href = 'registration.html';
                return;
            }
            
            const user = JSON.parse(currentUser);
            const product = {
                id: parseInt(btn.dataset.id),
                name: btn.dataset.name,
                price: parseInt(btn.dataset.price),
                image: btn.dataset.image
            };
            
            await cartDB.addToCart(user.phoneNumber, product);
            alert('Товар добавлен в корзину');
        });
    });
}

async function updateCatalog() {
    let filtered = await productDB.getAllProducts();
    
    const searchValue = searchInput.value.toLowerCase();
    const category = filterSelect.value;
    
    if (category && category !== "all" && category !== "") {
        filtered = filtered.filter(p => p.category === category);
    }
    if (searchValue) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchValue));
    }
    renderProducts(filtered);
}

const existingProducts = await productDB.getAllProducts();
if (existingProducts.length === 0) {
    const products = [
        { id: 1, name: "Кислые червячки", price: 169, weight: "200 г (20-25 шт.)", category: "sour", image: "/img/product1.png" },
        { id: 2, name: "Лимонные дольки", price: 189, weight: "200 г (12-14 долек)", category: "sour", image: "/img/product2.png" },
        { id: 3, name: "Апельсиновые дольки", price: 259, weight: "150 г (5-6 долек)", category: "sweet", image: "/img/product3.png" },
        { id: 4, name: "Клубника со сливками", price: 279, weight: "150 г (6-8 шт.)", category: "sweet", image: "/img/product4.png" },
        { id: 5, name: "Зеленое яблоко", price: 199, weight: "200 г (15-18 шт.)", category: "sour", image: "/img/product5.png" },
        { id: 6, name: "Малина-ежевика", price: 299, weight: "150 г (8-10 шт.)", category: "sweet", image: "/img/product6.png" },
        { id: 7, name: "Кола-леденец", price: 179, weight: "200 г (16-20 шт.)", category: "sweet", image: "/img/product7.png" },
        { id: 8, name: "Грейпфрут", price: 209, weight: "200 г (12-14 долек)", category: "sour", image: "/img/product8.png" },
        { id: 9, name: "Дыня-манго", price: 289, weight: "150 г (7-9 шт.)", category: "sweet", image: "/img/product9.png" },
        { id: 10, name: "Вишня", price: 249, weight: "200 г (10-12 шт.)", category: "sweet", image: "/img/product10.png" },
        { id: 11, name: "Персик-маракуйя", price: 285, weight: "150 г (10-12 шт.)", category: "sweet", image: "/img/product11.png" },
        { id: 12, name: "Ванильный флан", price: 275, weight: "150 г (6-8 шт.)", category: "sweet", image: "/img/product12.png" },
        { id: 13, name: "Арбуз", price: 199, weight: "200 г (10-12 шт.)", category: "sour", image: "/img/product13.png" },
        { id: 14, name: "Эвкалипт-мята", price: 289, weight: "180 г (15-18 шт.)", category: "other", image: "/img/product14.png" },
        { id: 15, name: "Мармелад-ные мишки", price: 219, weight: "250 г", category: "sweet", image: "/img/product15.png" },
    ];
    
    for (const product of products) {
        await productDB.addProduct(product);
    }
}

await updateCatalog();

searchInput.addEventListener("input", updateCatalog);
filterSelect.addEventListener("change", updateCatalog);