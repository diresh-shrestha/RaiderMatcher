// jshint esversion:8
const mongoose = require('mongoose');
const arrayUniquePlugin = require('mongoose-unique-array');
const studentQuestions = require('../Question-Answers/questions');
const defaultAnswers = require('../Question-Answers/defaultAnswers');
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
  questions: {
    type: Array,
    default: studentQuestions,
  },
  answers: {
    type: Array,
    default: defaultAnswers
  },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
});

// Student Model
// studentSchema.plugin(beautifyUnique);
studentSchema.plugin(arrayUniquePlugin);
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
