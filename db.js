// db.js

const mongoose = require('mongoose');

// Fungsi untuk terhubung ke MongoDB
async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/football', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = connect;
