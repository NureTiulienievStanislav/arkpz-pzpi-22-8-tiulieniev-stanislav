// apiRoutes.js
const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Реєстрація користувача
router.post('/register', apiController.registerUser);

// Додавання транспортного засобу
router.post('/vehicle', apiController.addVehicle);

// Отримання всіх маршрутів
router.get('/routes', apiController.getRoutes);

// Отримання сповіщень для користувача
router.get('/notifications', apiController.getNotifications);

module.exports = router;
