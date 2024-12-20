const client = require('./db'); // Підключення до бази даних

// Функція для реєстрації користувача
async function registerUser(name, password, role) {
  const query = 'INSERT INTO users (name, password, role) VALUES ($1, $2, $3) RETURNING user_id, name, role';
  const values = [name, password, role];
  
  try {
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error('Помилка при реєстрації користувача');
  }
}

// Функція для авторизації користувача
async function loginUser(name, password) {
  const query = 'SELECT * FROM users WHERE name = $1';
  const values = [name];
  
  try {
    const result = await client.query(query, values);
    if (result.rows.length === 0 || result.rows[0].password !== password) {
      throw new Error('Невірний логін або пароль');
    }
    return result.rows[0];
  } catch (err) {
    throw new Error('Невірний логін або пароль');
  }
}

// Функція для додавання машини
async function addVehicle(model, license_plate, status) {
  const query = 'INSERT INTO vehicles (model, license_plate, status) VALUES ($1, $2, $3) RETURNING vehicle_id, model, license_plate, status';
  const values = [model, license_plate, status];
  
  try {
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error('Помилка при додаванні машини');
  }
}

// Функція для додавання маршруту
async function addRoute(start_location, end_location, distance) {
  const query = 'INSERT INTO routes (start_location, end_location, distance) VALUES ($1, $2, $3) RETURNING route_id, start_location, end_location, distance';
  const values = [start_location, end_location, distance];
  
  try {
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error('Помилка при додаванні маршруту');
  }
}

module.exports = { registerUser, loginUser, addVehicle, addRoute };
