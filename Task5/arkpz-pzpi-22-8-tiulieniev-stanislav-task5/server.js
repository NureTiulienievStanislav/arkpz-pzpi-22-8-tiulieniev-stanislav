const express = require('express');
const client = require('./db');
const { registerUser, loginUser, addVehicle, addRoute, getAllUsers, deleteUser, deleteVehicle } = require('./functions');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API для роботи з "Програмна система для управління автопарком"',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      {
        name: 'Admin',
        description: 'Функції для адміністратора.',
      },
      {
        name: 'Default',
        description: 'Функції для звичайного користувача.',
      },
    ],
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Реєстрація користувача
 *     description: Реєстрація нового користувача
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *             required:
 *               - name
 *               - password
 *               - role
 *     responses:
 *       200:
 *         description: Користувач успішно зареєстрований
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Помилка при реєстрації користувача
 */
app.post('/register', async (req, res) => {
  const { name, password, role } = req.body;
  try {
    const user = await registerUser(name, password, role);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Помилка при реєстрації користувача' });
  }
});
/**
 * @swagger
 * /sensor-data:
 *   post:
 *     tags:
 *       - Default
 *     summary: Отримання даних з датчиків
 *     description: Збереження даних з датчиків у базу даних
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicle_id:
 *                 type: integer
 *               distance_front:
 *                 type: integer
 *               distance_back:
 *                 type: integer
 *             required:
 *               - vehicle_id
 *               - distance_front
 *               - distance_back
 *     responses:
 *       200:
 *         description: Дані з датчиків успішно збережено
 *       400:
 *         description: Помилка при збереженні даних з датчиків
 */
app.post('/sensor-data', async (req, res) => {
  const { vehicle_id, distance_front, distance_back } = req.body;
  try {
    const result = await client.query(
      'UPDATE vehicles SET distance_front = $1, distance_back = $2 WHERE vehicle_id = $3 RETURNING *',
      [distance_front, distance_back, vehicle_id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Помилка при збереженні даних з датчиків' });
  }
});
/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Default
 *     summary: Авторизація користувача
 *     description: Авторизація користувача для входу в систему
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - password
 *     responses:
 *       200:
 *         description: Користувач успішно авторизований
 *       400:
 *         description: Невірний логін або пароль
 */
app.post('/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await loginUser(name, password);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Невірний логін або пароль' });
  }
});

/**
 * @swagger
 * /vehicle:
 *   post:
 *     tags:
 *       - Default
 *     summary: Додавання нової машини
 *     description: Додавання нової машини до системи
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *               license_plate:
 *                 type: string
 *               status:
 *                 type: string
 *             required:
 *               - model
 *               - license_plate
 *               - status
 *     responses:
 *       200:
 *         description: Машина успішно додана
 *       400:
 *         description: Помилка при додаванні машини
 */
app.post('/vehicle', authenticateToken, async (req, res) => {
  const { model, license_plate, status } = req.body;
  try {
    const vehicle = await addVehicle(model, license_plate, status);
    res.status(200).json(vehicle);
  } catch (err) {
    res.status(400).json({ error: 'Помилка при додаванні машини' });
  }
});


/**
 * @swagger
 * /route:
 *   post:
 *     tags:
 *       - Default
 *     summary: Додавання нового маршруту
 *     description: Додавання нового маршруту до системи
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_location:
 *                 type: string
 *               end_location:
 *                 type: string
 *               distance:
 *                 type: number
 *             required:
 *               - start_location
 *               - end_location
 *               - distance
 *     responses:
 *       200:
 *         description: Маршрут успішно доданий
 *       400:
 *         description: Помилка при додаванні маршруту
 */
app.post('/route', authenticateToken, async (req, res) => {
  const { start_location, end_location, distance } = req.body;
  try {
    const route = await addRoute(start_location, end_location, distance);
    res.status(200).json(route);
  } catch (err) {
    res.status(400).json({ error: 'Помилка при додаванні маршруту' });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Отримання всіх користувачів
 *     description: Отримання списку всіх користувачів (тільки для адміністраторів)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список користувачів
 *       400:
 *         description: Помилка при отриманні списку користувачів
 */
app.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: 'Помилка при отриманні списку користувачів' });
  }
});

/**
 * @swagger
 * /vehicles:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Отримання всіх транспортних засобів
 *     description: Отримання списку всіх транспортних засобів (тільки для адміністраторів)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список транспортних засобів
 *       400:
 *         description: Помилка при отриманні списку транспортних засобів
 */
app.get('/vehicles', authenticateToken, isAdmin, async (req, res) => {
  try {
    const vehicles = await getAllVehicles();
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(400).json({ error: 'Помилка при отриманні списку транспортних засобів' });
  }
});

/**
 * @swagger
 * /delete-user/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Видалення користувача
 *     description: Видалення користувача за ID (тільки для адміністраторів)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID користувача для видалення
 *     responses:
 *       200:
 *         description: Користувача успішно видалено
 *       400:
 *         description: Помилка при видаленні користувача
 */
app.delete('/delete-user/:id', authenticateToken, isAdmin, async (req, res) => {
  const userId = req.params.id;
  try {
    const success = await deleteUser(userId);
    if (success) {
      res.status(200).json({ message: 'Користувача успішно видалено' });
    } else {
      res.status(400).json({ error: 'Не вдалося видалити користувача' });
    }
  } catch (err) {
    res.status(400).json({ error: 'Помилка при видаленні користувача' });
  }
});

/**
 * @swagger
 * /delete-vehicle/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Видалення транспортного засобу
 *     description: Видалення транспортного засобу за ID (тільки для адміністраторів)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID транспортного засобу для видалення
 *     responses:
 *       200:
 *         description: Транспортний засіб успішно видалено
 *       400:
 *         description: Помилка при видаленні транспортного засобу
 */
app.delete('/delete-vehicle/:id', authenticateToken, isAdmin, async (req, res) => {
  const vehicleId = req.params.id;
  try {
    const success = await deleteVehicle(vehicleId);
    if (success) {
      res.status(200).json({ message: 'Транспортний засіб успішно видалено' });
    } else {
      res.status(400).json({ error: 'Не вдалося видалити транспортний засіб' });
    }
  } catch (err) {
    res.status(400).json({ error: 'Помилка при видаленні транспортного засобу' });
  }
});

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Должен совпадать с ключом в functions.js

// Middleware для проверки токена
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Токен відсутній' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недійсний токен' });
    }
    req.user = user;
    next();
  });
}

// Middleware для проверки роли администратора
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ заборонено' });
  }
  next();
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});