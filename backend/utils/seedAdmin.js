require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');
const logger = require('./logger');

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@hospital.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminName = process.env.ADMIN_NAME || 'Super Admin';
    const adminPhone = process.env.ADMIN_PHONE || '1234567890';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      logger.info(`Admin user already exists: ${adminEmail}`);
      logger.info('Skipping admin seed.');
      process.exit(0);
    }

    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      phone: adminPhone,
      isActive: true
    });

    logger.info('Admin user created successfully:');
    logger.info(`Email: ${adminEmail}`);
    logger.info(`Name: ${adminName}`);
    logger.info(`Role: admin`);
    logger.info('Password: (Check your .env file)');
    logger.info('');
    logger.info('IMPORTANT: Change the default password after first login!');

    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
