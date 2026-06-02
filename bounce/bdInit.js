import { ProductDatabase } from './db.js';
import { UserDatabase } from './authDb.js';

const productDB = new ProductDatabase();
await productDB.init();

const userDB = new UserDatabase();
await userDB.init();

try {
    await userDB.addUser({
        phoneNumber: "+79991234567",
        name: "Тестовый пользователь",
        password: "123",
        createdAt: new Date().toISOString()
    });
} catch(e) {
    console.log('Пользователь уже существует');
}

window.productDB = productDB;
window.userDB = userDB;