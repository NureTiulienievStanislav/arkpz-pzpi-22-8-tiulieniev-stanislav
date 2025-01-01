// apiController.js
const { User, Vehicle, Route, Notification } = require('../models/models');

// Реєстрація користувача
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Додавання транспортного засобу
const addVehicle = async (req, res) => {
  const { model, license_plate, status } = req.body;
  try {
    const vehicle = await Vehicle.create({ model, license_plate, status });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Отримання маршрутів
const getRoutes = async (req, res) => {
  try {
    const routes = await Route.findAll();
    res.status(200).json(routes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Отримання сповіщень для користувача
const getNotifications = async (req, res) => {
  const { user_id } = req.query;
  try {
    const notifications = await Notification.findAll({ where: { user_id } });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { registerUser, addVehicle, getRoutes, getNotifications };
