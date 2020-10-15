// jshint esversion:8
const mongoose = require('mongoose');
// const beautifyUnique = require('mongoose-beautiful-unique-validation');

// Course Schema
const courseSchema = new mongoose.Schema({
  // department: {
  //   required: true,
  //   type: String
  // },
  // courseCode: {
  //   required: true,
  //   type: Number // This could also be a String
  // },
  // _id: mongoose.Schema.Types.ObjectId,
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
const Course = mongoose.model('Course', courseSchema);


module.exports = Course;
