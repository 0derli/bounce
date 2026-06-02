
export class CartDatabase {
    constructor() {
        this.dbName = 'CartDB';
        this.dbVersion = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject('Ошибка открытия БД корзины');
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('cart')) {
                    const cartStore = db.createObjectStore('cart', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    cartStore.createIndex('phoneNumber', 'phoneNumber', { unique: false });
                    cartStore.createIndex('productId', 'productId', { unique: false });
                }
                if (!db.objectStoreNames.contains('orders')) {
                    const ordersStore = db.createObjectStore('orders', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    ordersStore.createIndex('phoneNumber', 'phoneNumber', { unique: false });
                    ordersStore.createIndex('date', 'date', { unique: false });
                }
            };
        });
    }

    async addToCart(phoneNumber, product) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['cart'], 'readwrite');
            const store = transaction.objectStore('cart');
            const request = store.add({
                phoneNumber: phoneNumber,
                productId: product.id,
                product: product,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
            
            request.onsuccess = () => resolve('Товар добавлен в корзину');
            request.onerror = () => reject('Ошибка добавления');
        });
    }

    async getCart(phoneNumber) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['cart'], 'readonly');
            const index = transaction.objectStore('cart').index('phoneNumber');
            const request = index.getAll(phoneNumber);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async removeFromCart(cartId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['cart'], 'readwrite');
            const request = transaction.objectStore('cart').delete(cartId);
            
            request.onsuccess = () => resolve('Удалено');
            request.onerror = () => reject('Ошибка удаления');
        });
    }

    async clearCart(phoneNumber) {
        const items = await this.getCart(phoneNumber);
        for (const item of items) {
            await this.removeFromCart(item.id);
        }
    }

    async createOrder(phoneNumber, orderData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['orders'], 'readwrite');
            const store = transaction.objectStore('orders');
            const request = store.add({
                phoneNumber: phoneNumber,
                date: new Date().toISOString(),
                items: orderData.items,
                total: orderData.total,
                address: orderData.address,
                name: orderData.name,
                phone: orderData.phone
            });
            
            request.onsuccess = () => resolve('Заказ оформлен');
            request.onerror = () => reject('Ошибка оформления');
        });
    }

    async getOrders(phoneNumber) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['orders'], 'readonly');
            const index = transaction.objectStore('orders').index('phoneNumber');
            const request = index.getAll(phoneNumber);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}