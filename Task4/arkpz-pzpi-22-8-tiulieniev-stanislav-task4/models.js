// models.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');  // Використовуємо підключення до БД

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: DataTypes.STRING,
  role: DataTypes.STRING,
});

const Vehicle = sequelize.define('Vehicle', {
  vehicle_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  model: DataTypes.STRING,
  license_plate: DataTypes.STRING,
  status: DataTypes.STRING,
});

const Route = sequelize.define('Route', {
  route_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  start_location: DataTypes.STRING,
  end_location: DataTypes.STRING,
  distance: DataTypes.FLOAT,
});

const Notification = sequelize.define('Notification', {
  notification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message: DataTypes.STRING,
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Зв'язки між моделями
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { User, Vehicle, Route, Notification };
