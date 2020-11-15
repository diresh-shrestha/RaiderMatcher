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

const studentsCreate = ctrlStudent.studentsCreate;
const studentsReadAll = ctrlStudent.studentsReadAll;
const studentsDeleteAll = ctrlStudent.studentsDeleteAll;
const studentsReadOne = ctrlStudent.studentsReadOne;
const studentsUpdateOne = ctrlStudent.studentsUpdateOne;
const studentsDeleteOne = ctrlStudent.studentsDeleteOne;
const studentsUpdateAnswers = ctrlStudent.studentsUpdateAnswers;

// COURSES TESTING
const create_courses = function() {
  // CREATE COURSES
  // Create Course without anything (should return error)
  coursesCreate().then(response => console.log("1: " + response));

  // Create Course with just name
  coursesCreate({ course: "CS 1500", courseName: "Databases for Idiots"}).then(response => console.log("2: " + response));

  // Test Duplicate
  coursesCreate({ course: "CS 1400"}).then(response => console.log("3: " + response));
  coursesCreate({ course: "CS 1400"}).then(response => console.log("4: " + response));

  // Should have CS 1400 and CS 1500
  // coursesReadAll().then(response => (console.log("All courses: \n" + response)));
};

const create_students = function() {
  // CREATE STUDENTS
  studentsCreate({ studentTag: "DISCORDID1" })
    .then(createdStudent => console.log(createdStudent));

  // Duplicate Test
  studentsCreate({ studentTag: "DISCORDID2", name: "Big Mac", classification: "Sophomore", major: "Business", adminStatus: true })
    .then(createdStudent => console.log(createdStudent));

  // Should have two students
  // studentsReadAll().then(response => (console.log("All Students: \n" + response)));
};

const reading = function() {
  studentsReadOne("DISCORDID2").then(res => console.log(res));
  coursesReadOne("CS 1400").then(res => (console.log(res)));
};

const updateTests = function() {
  // COURSES UPDATE
  // check adding and deleting students to and from courses SUCCESS
  // coursesUpdateOne({ course: "CS 1400", newCourseName: "poop class", studentToAddTag: "DISCORDID2" });
  // coursesUpdateOne({ course: "CS 1400", studentToRemoveTag: "DISCORDID1" });
  //
  // coursesUpdateOne({ course: "CS 1500", newCourseName: "poop class 2", studentToAddTag: "DISCORDID2" });
  // coursesUpdateOne({ course: "CS 1500", studentToAddTag: "DISCORDID1" });

  // check deleteStudents functionality
  // coursesUpdateOne( { course: "CS 1500", deleteStudents: true} );


  // STUDENTS UPDATE
  // check adding and deleting courses to and from students
  // studentsUpdateOne({ courseToAdd: "CS 1400", studentTag: "DISCORDID2", newStudentName: "John", newStudentClassification: "Freshman",
  //   newStudentMajor: "Dog", toggleAdminStatus: true });
  // studentsUpdateOne({ studentTag: "DISCORDID2", deleteCourses: true });

  // check all students update functionality
};

// Read All SUCCESS
studentsReadAll().then(response => (console.log("All Students: \n" + response)));
// coursesReadAll().then(response => (console.log("All courses: \n" + response)));

// All FAILURE
// updateTests();

// DeleteOne Functionality here FAILURE
// studentsDeleteOne("DISCORDID2");
// coursesDeleteOne("CS 1400");

// Test with arrays filled SUCCESS
// reading();

// Creating courses SUCCESS
// create_courses();

// Creating students SUCCESS
// create_students();

// Delete all students and courses SUCCESS
// studentsDeleteAll();
// coursesDeleteAll();

// Test updated answers
// studentsUpdateAnswers('DISCORDID1', ["Answer 1", "Answer 2"]);
