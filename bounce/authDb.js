
export class UserDatabase {
    constructor() {
        this.dbName = 'UserAuthDB'; 
        this.dbVersion = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject('Ошибка открытия БД пользователей');
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', { 
                        keyPath: 'phoneNumber'
                    });
                    userStore.createIndex('name', 'name');
                }
            };
        });
    }

    async addUser(user) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            const request = store.add({
                phoneNumber: user.phoneNumber,
                name: user.name,
                password: user.password,
                createdAt: new Date().toISOString()
            });
            
            request.onsuccess = () => resolve('Регистрация успешна');
            request.onerror = () => reject('Пользователь уже существует');
        });
    }

    async loginUser(phoneNumber, password) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.get(phoneNumber);
            
            request.onsuccess = () => {
                const user = request.result;
                if (!user) resolve({ success: false, message: 'Пользователь не найден' });
                else if (user.password !== password) resolve({ success: false, message: 'Неверный пароль' });
                else resolve({ success: true, message: 'Вход выполнен', user });
            };
            request.onerror = () => reject('Ошибка');
        });
    }
}

