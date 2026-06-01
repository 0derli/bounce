const products = [
    {
        id: 1,
        name: "Кислые червячки",
        price: "169 ₽",
        weight: "200 г (20-25 шт.)",
        category: "sour",
        image: "/img/product1.png"
    },
    {
        id: 2,
        name: "Лимонные дольки",
        price: "189 ₽",
        weight: "200 г (12-14 долек)",
        category: "sour",
        image: "/img/product2.png"
    },
    {
        id: 3,
        name: "Апельсиновые дольки",
        price: "259 ₽",
        weight: "150 г (5-6 долек)",
        category: "sweet",
        image: "/img/product3.png"
    },
    {
        id: 4,
        name: "Клубника со сливками",
        price: "279 ₽",
        weight: "150 г (6-8 шт.)",
        category: "sweet",
        image: "/img/product4.png"
    },
    {
        id: 5,
        name: "Зеленое яблоко",
        price: "199 ₽",
        weight: "200 г (15-18 шт.)",
        category: "sour",
        image: "/img/product5.png"
    },
    {
        id: 6,
        name: "Малина-ежевика",
        price: "299 ₽",
        weight: "150 г (8-10 шт.)",
        category: "sweet",
        image: "/img/product6.png"
    },
    {
        id: 7,
        name: "Кола-леденец",
        price: "179 ₽",
        weight: "200 г (16-20 шт.)",
        category: "sweet",
        image: "/img/product7.png"
    },
    {
        id: 8,
        name: "Грейпфрут",
        price: "209 ₽",
        weight: "200 г (12-14 долек)",
        category: "sour",
        image: "/img/product8.png"
    },
    {
        id: 9,
        name: "Дыня-манго",
        price: "289 ₽",
        weight: "150 г (7-9 шт.)",
        category: "sweet",
        image: "/img/product9.png"
    },
    {
        id: 10,
        name: "Вишня",
        price: "249 ₽",
        weight: "200 г (10-12 шт.)",
        category: "sweet",
        image: "/img/product10.png"
    },
    {
        id: 11,
        name: "Персик-маракуйя",
        price: "285 ₽",
        weight: "150 г (10-12 шт.)",
        category: "sweet",
        image: "/img/product11.png"
    },
    {
        id: 12,
        name: "Ванильный флан",
        price: "275 ₽",
        weight: "150 г (6-8 шт.)",
        category: "sweet",
        image: "/img/product12.png"
    },
    {
        id: 13,
        name: "Арбуз",
        price: "199 ₽",
        weight: "200 г (10-12 шт.)",
        category: "sour",
        image: "/img/product13.png"
    },
    {
        id: 14,
        name: "Эвкалипт-мята",
        price: "289 ₽",
        weight: "180 г (15-18 шт.)",
        category: "other",
        image: "/img/product14.png"
    },
    {
        id: 15,
        name: "Мармелад-ные мишки",
        price: "219 ₽",
        weight: "250 г",
        category: "sweet",
        image: "/img/product15.png"
    },
]

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
            <button class="cardBtn">В корзину</button>
        </div>
        `;
    });
}

function updateCatalog() {
    let filtered = products;
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

searchInput.addEventListener("input", updateCatalog);
filterSelect.addEventListener("change", updateCatalog);

renderProducts(products);