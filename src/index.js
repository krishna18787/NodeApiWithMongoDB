require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not set in the environment');
    }

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    try {
      await connectDB();
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
    }
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

mongoose.connection.on('error', (error) => {
  console.error('MongoDB runtime error:', error.message);
});

startServer();
