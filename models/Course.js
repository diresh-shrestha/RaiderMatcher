// jshint esversion:8
const mongoose = require('mongoose');
const arrayUniquePlugin = require('mongoose-unique-array');
// const beautifyUnique = require('mongoose-beautiful-unique-validation');

// Course Schema
const courseSchema = new mongoose.Schema({
  // "CS 1400"
  course: {
    type: String,
    uppercase: true,
    required: true,
    unique: "Course already exists"
  },
  courseName: {
    type: String,
  },
  books: [String],  // This can make things complicated in coursesUpdateOne()
  students: [{ type: mongoose.Schema.Types.ObjectId , ref: 'Student' }]
});

// Course Model
// courseSchema.plugin(beautifyUnique);
courseSchema.plugin(arrayUniquePlugin);
const Course = mongoose.model('Course', courseSchema);


module.exports = Course;

