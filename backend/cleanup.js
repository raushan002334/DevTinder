const mongoose = require('mongoose');
const User = require('./src/models/user');
const connectDB = require('./src/config/database');

async function cleanup() {
  await connectDB();
  const res = await User.deleteMany({ emailId: { $regex: /example/ } });
  console.log('Deleted:', res.deletedCount);
  process.exit();
}
cleanup();
