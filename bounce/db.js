const DB_NAME = 'ProductsDB';
const DB_VERSION = 1;
const STORE_NAME = 'products';

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { 
                    keyPath: 'id', 
                    autoIncrement: false 
                });
                store.createIndex('name', 'name', { unique: false });
                store.createIndex('category', 'category', { unique: false });
                store.createIndex('price', 'price', { unique: false });
            }
        };
    });
}

export class ProductDatabase {
    async init() {
        this.db = await openDB();
    }
    
    async addProduct(product) {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        return new Promise((resolve, reject) => {
            const request = transaction.objectStore(STORE_NAME).add(product);
            request.onsuccess = () => resolve(product);
            request.onerror = () => reject(request.error);
        });
    }
    
    async getAllProducts() {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}