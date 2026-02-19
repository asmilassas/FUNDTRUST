/* eslint-disable no-console */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectDB = require('../src/config/db');
const Charity = require('../src/models/Charity');

const run = async () => {
  try {
    await connectDB();

    const charitiesPath = path.join(__dirname, 'charities.json');
    const payload = JSON.parse(fs.readFileSync(charitiesPath, 'utf-8'));

    await Charity.deleteMany({});
    await Charity.insertMany(payload);

    console.log(`Seeded ${payload.length} charities.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed', error);
    process.exit(1);
  }
};

run();
