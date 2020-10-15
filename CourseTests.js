//  jshint esversion: 8

// NOTE: Everytime db is required, it opens a new connection.
// Once max connections reached must restart computer.
require('./models/db');
const mongoose = require('mongoose');
const ctrlCourse = require('./controllers/course');
const ctrlStudent = require('./controllers/student');

const Course = require('./models/Course');
const Student = require('./models/Student');

const coursesCreate = ctrlCourse.coursesCreate;
const coursesReadAll = ctrlCourse.coursesReadAll;
const coursesDeleteAll = ctrlCourse.coursesDeleteAll;
const coursesReadOne = ctrlCourse.coursesReadOne;
const coursesUpdateOne = ctrlCourse.coursesUpdateOne;
const coursesDeleteOne = ctrlCourse.coursesDeleteOne;

// COURSES TESTING

// Success
const creatian_test = function() {
  // Create Course with just name
  coursesCreate().then(response => console.log("1: " + response));
  // Create Course with just name
  coursesCreate("CS 1500", "Databases for Idiots").then(response => console.log("2: " + response));
  // Test Duplicate
  coursesCreate("CS 1400").then(response => console.log("3: " + response));
  // Should have CS 1400 and CS 1500
  // coursesReadAll().then(response => (console.log(response)));
};

// Success
const read_one_test = function() {
    // coursesReadAll().then(response => (
    //   coursesReadOne(response[1]._id).then(response => console.log("Read One Test Passed: " + (response.courseName == 'Databases for Idiots')))));
    coursesReadOne({courseId: "5f87655dc1c6ce3d0a839642"}).then(response => console.log(response));
};

// Success
const update_tests = function() {

  const new_student_one = new Student({ name: "John Doe" });
  new_student_one.save();
  console.log(String(new_student_one._id));
  coursesUpdateOne({courseId: '5f87655dc1c6ce3d0a839642', newCourseValue: "CS 1472", newCourseName: "Algo",
    deleteStudents: false, studentToRemoveId: null, studentToAddId: String(new_student_one._id)});

  // coursesUpdateOne({courseId: '5f83a459ad39d4049c26da45', studentToAddId: "5f83a43e34c3da04908d4d88"});
  // coursesUpdateOne({courseId: '5f83a459ad39d4049c26da45', studentToAddId: "5f83a43e34c3da04908d4d89"});
};

// Success
const delete_one = function() {
  coursesDeleteOne("5f87655dc1c6ce3d0a839642");
};

// Success
const delete_all = function() {
  coursesDeleteAll();
};

// 5f82868fb49d7a7d6b627f12
// coursesDeleteAll();
// creatian_test();
// read_one_test();
// update_tests();
// delete_one();
coursesReadAll().then(response => console.log(response));
// coursesReadOne({ course: 'Cs 4000' }).then(response => console.log(response));

// mongoose.connection.close();
