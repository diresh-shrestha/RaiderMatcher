// jshint esversion:8
const mongoose = require("mongoose");

let mongoURI = 'mongodb://localhost:27017/raiderMatcher';
const options =  {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(mongoURI, options);

const db = mongoose.connection;

db.on('connected', () => {
  console.log(`Mongoose connected to ${mongoURI}`);
});
db.on('error', err => {
  console.log('Mongoose connection error:', err);
});
db.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

module.exports = db;
