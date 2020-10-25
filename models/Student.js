// jshint esversion:8
const mongoose = require('mongoose');
const arrayUniquePlugin = require('mongoose-unique-array');
// const beautifyUnique = require('mongoose-beautiful-unique-validation');

// Student Schema
const studentSchema = new mongoose.Schema({
  studentTag: {
    type: String,
    required: true,
    unique: "Student has already joined server"
  },
  name: {
    type: String,
    lowercase: true
  },
  classification: String,
  major: String,
  adminStatus: {
    type: Boolean,
    default: false
  },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
});

// Student Model
// studentSchema.plugin(beautifyUnique);
studentSchema.plugin(arrayUniquePlugin);
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
