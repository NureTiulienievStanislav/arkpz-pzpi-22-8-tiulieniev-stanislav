const mqtt = require('mqtt');
const { Pool } = require('pg');

// Підключення до PostgreSQL
const pool = new Pool({
  user: 'postgres',  // ваше ім'я користувача
  host: 'localhost',
  database: 'postgres',  // назва вашої бази даних
  password: '0558',  // ваш пароль
  port: 5432,
});

// Перевірка підключення до бази даних
pool.connect()
  .then(() => console.log('Підключено до бази даних'))
  .catch(err => console.error('Помилка при підключенні до бази даних:', err.message));

if (!pool) {
  console.error('Pool не визначено. Перевірте підключення до бази даних.');
  return; // Вихід із сервера
}

// Підключення до MQTT брокера
const mqttBroker = 'mqtt://broker.hivemq.com'; // або змініть на інший брокер
const topic = 'autocare/iot';

const mqttClient = mqtt.connect(mqttBroker);

mqttClient.on('connect', () => {
  console.log('Підключено до MQTT брокера');
  mqttClient.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Підписка на топік: ${topic}`);
    } else {
      console.error('Помилка підписки:', err);
    }
  });
});

mqttClient.on('message', async (topic, message) => {
  console.log(`Отримано повідомлення з топіка: ${topic}`);
  let payload;

  try {
    console.log('Отримане повідомлення:', message.toString());
    payload = JSON.parse(message.toString());

    // Перевірка на відсутність необхідних даних
    if (!payload.distance_front || !payload.distance_back || !payload.licence_plate) {
      throw new Error('Відсутні необхідні дані');
    }

    // Оновлення даних у базі
    const query = `
      UPDATE vehicles
      SET distance_front = $1, distance_back = $2
      WHERE license_plate = $3
    `;
    await pool.query(query, [payload.distance_front, payload.distance_back, payload.licence_plate]);
    console.log('Дані оновлені в базі даних');
  } catch (err) {
    console.error('Помилка при обробці повідомлення або оновленні бази даних:', err.message);
  }
});

// Закриття підключень при завершенні роботи
process.on('exit', () => {
  pool.end();
  mqttClient.end();
});

module.exports = pool;
