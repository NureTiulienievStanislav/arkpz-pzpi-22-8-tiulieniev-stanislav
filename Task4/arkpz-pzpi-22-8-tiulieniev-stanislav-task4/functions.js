const client = require('./db'); // Підключення до бази даних

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Замените на ваш секретный ключ

// Генерація токена
function generateToken(user) {
  return jwt.sign({ id: user.user_id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
}

// Перевірка токена
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

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
  const result = await client.query('SELECT * FROM users WHERE name = $1 AND password = $2', [name, password]);
  if (result.rows.length === 0) {
    throw new Error('Невірний логін або пароль');
  }
  const user = result.rows[0];
  const token = generateToken(user);
  return { user, token };
}

// Функція для додавання машини
async function addVehicle(model, license_plate, status, distance_front, distance_back) {
  const result = await client.query(
    'INSERT INTO vehicles (model, license_plate, status, distance_front, distance_back) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [model, license_plate, status, distance_front, distance_back]
  );
  return result.rows[0];
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

// Функція для показу всіх користувачів (admin only)
async function getAllUsers() {
  const result = await client.query('SELECT * FROM users');
  return result.rows;
}

async function deleteVehicle(vehicleId) {
  const result = await client.query('DELETE FROM vehicles WHERE vehicle_id = $1 RETURNING *', [vehicleId]);
  return result.rowCount > 0; 
}

async function deleteUser(userId) {
  const result = await client.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [userId]);
  return result.rowCount > 0; 
}
// Отримання всіх транспортних засобів
async function getAllVehicles() {
  const result = await client.query('SELECT * FROM vehicles');
  return result.rows;
}
module.exports = {
  registerUser,
  loginUser,
  addVehicle,
  addRoute,
  getAllUsers,
  deleteUser,
  deleteVehicle,
  getAllVehicles,
};

