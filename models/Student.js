// jshint esversion:8
const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

// Student Schema
const studentSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  name: {
    required: true,
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
studentSchema.plugin(beautifyUnique);
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
