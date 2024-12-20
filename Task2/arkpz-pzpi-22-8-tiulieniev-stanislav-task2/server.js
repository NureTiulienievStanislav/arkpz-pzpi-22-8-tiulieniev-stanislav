const express = require('express');
const client = require('./db');
const { registerUser, loginUser, addVehicle, addRoute } = require('./functions');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API для роботи з "Програмна система для управління паркуванням"',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
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
 * /login:
 *   post:
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
 *     summary: Додавання нової машини
 *     description: Додавання нової машини до системи
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vehicle_id:
 *                   type: integer
 *                 model:
 *                   type: string
 *                 license_plate:
 *                   type: string
 *                 status:
 *                   type: string
 *       400:
 *         description: Помилка при додаванні машини
 */
app.post('/vehicle', async (req, res) => {
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
 *     summary: Додавання нового маршруту
 *     description: Додавання нового маршруту до системи
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 route_id:
 *                   type: integer
 *                 start_location:
 *                   type: string
 *                 end_location:
 *                   type: string
 *                 distance:
 *                   type: number
 *       400:
 *         description: Помилка при додаванні маршруту
 */
app.post('/route', async (req, res) => {
  const { start_location, end_location, distance } = req.body;
  try {
    const route = await addRoute(start_location, end_location, distance);
    res.status(200).json(route);
  } catch (err) {
    res.status(400).json({ error: 'Помилка при додаванні маршруту' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
