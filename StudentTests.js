 // jshint esversion: 8

// NOTE: Everytime db is required, it opens a new connection.
// Once max connections reached must restart computer.
require('./models/db');
const mongoose = require('mongoose');
const ctrlCourse = require('./controllers/course');
const ctrlStudent = require('./controllers/student');

const Course = require('./models/Course');
const Student = require('./models/Student');

const studentsCreate = ctrlStudent.studentsCreate;
const studentsReadAll = ctrlStudent.studentsReadAll;
const studentsDeleteAll = ctrlStudent.studentsDeleteAll;
const studentsReadOne = ctrlStudent.studentsReadOne;
const studentsUpdateOne = ctrlStudent.studentsUpdateOne;
const studentsDeleteOne = ctrlStudent.studentsDeleteOne;

// mongoose.set('debug', true);

// COURSES TESTING

// Success
const creation_test = function() {
  // Create Student with just name
  studentsCreate({ name: "Brown Guy"} )
  .then(response => console.log("1: " + response))
  .catch((err) => console.log(err));

  // Create Student with admin privaleges, classification, major
  // studentsCreate({ name: "Big Mac", classification: "Sophomore", major: "poop engineering", adminStatus: true}).then(response => console.log("2: " + response));
  // Should have Two Students when printed
  // coursesReadAll().then(response => (console.log(response)));
};

// Success
const read_one_test = function() {
  studentsReadOne("5f87832eb314f540ebc85ff7")
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

//
const update_tests = function() {
  let new_course;
  new_course = new Course({ course: "CS 4300" });
  new_course.save(function(err) {
    if (err) {
      console.log("error saving this test course: ");
      console.log(err);
    } else {

      studentsUpdateOne({
          studentId: "5f875bb132be0a3a17d1e2c4",
          newStudentName: "Big Pack",
          toggleAdminStatus: true,
          deleteCourses: false,
          courseToRemoveId: "5f83a24bafc3b703ecde8c42",
          // courseToAddId: String(new_course._id),
        });

        // studentsUpdateOne({
        //     studentId: "5f8385d33600230992ac27c5",
        //     newStudentName: "John Poe",
        //     newStudentClassification: "Junior",
        //     newStudentMajor: "Chemical Engineering",
        //     toggleAdminStatus: true,
        //     // deleteCourses: false,
        //     // courseToRemoveId: null,
        //     // newCourseToAdd: null,
        //   });
    }
  });

};

// Success
const delete_one = function() {
  studentsDeleteOne("5f87839e02813b40faf415fd");
};

// Success
const delete_all = function() {
  studentsDeleteAll();
};

// studentsUpdateOne({
//     studentId: "5f83a43e34c3da04908d4d89",
//     newStudentName: "Big Pack",
//     toggleAdminStatus: true,
//     deleteCourses: true,
//     // courseToRemoveId: "5f83a459ad39d4049c26da45",
//     // courseToAddId: String(new_course._id),
//   });

// update_tests();
// read_one_test();
// creation_test();
// delete_one();
// delete_all();

// console.log(studentsDeleteAll());
// studentsReadAll().then(response => console.log(response));


// When not populated course id shows
