# RaiderMatcher
A discord bot for college students 


RaiderMatcherDB Quick Start Guide
============
<!-- NOTE: This is a work in progress and you may get double outputs sometimes and stuff but it works -->


<!-- STARTING MongoDB for mongoose (MUST DO THIS BEFORE ACCESSING DATABASE) -->
<!-- You can look this up or put this in command line: -->
npm init
npm install mongodb --save
npm install mongoose
mongod    // Run this once before accessing database or functions and it will work until ctrl + c
<<ctrl+c to exit>>
<!-- NOTE: You can open another terminal and do other things in that while mongod run -->

<!--
This file opens the DB connection and will close it when finished. Only needs
to be imported once in main file.
 -->
require('./models/db');   

<!-- May need to require mongoose, but most functionality should be outsourced to separate DB files -->
const mongoose = require('mongoose');

<!-- Getting the functionality from the two collections -->
const ctrlCourse = require('./controllers/course');     <!-- Your path may be different -->
const ctrlStudent = require('./controllers/student');   <!-- Your path may be different -->

const studentsCreate = ctrlStudent.studentsCreate;
const studentsReadAll = ctrlStudent.studentsReadAll;
const studentsDeleteAll = ctrlStudent.studentsDeleteAll;
const coursesReadOne = ctrlStudent.studentsReadOne;
const coursesUpdateOne = ctrlStudent.studentsUpdateOne;
const coursesDeleteOne = ctrlStudent.studentsDeleteOne;

<!--
If you need to create a object for example purposes or testing your functionality
you can use the functions above, or use the models and make them by hand if comfortable
with mongoose
 -->
const Course = require('./models/Course');
const Student = require('./models/Student');

const new_course = new Course({ course: "CS 4000" });
new_course.save();

<!--
When using the getter functions, save functions, anything that return something like functions
above, these will not return the results needed before next lines of code. Getting stuff from
database takes time.

These functions should follow below format when you want to use their returned values:
studentsReadOne()
studentsRealAll()
studentsCreate()

coursesReadOne()
coursesRealAll()
coursesCreate()
-->

 <!-- Wrong Usage Example -->
 let allStudents = studentsReadAll();
 console.log(allStudents);  // prints "undefined"
 someFunction(allStudents);     // Throws error and crashes because students weren't gotten in time

<!-- Instead, you must let it finish and after use the ".then()" syntax -->
<!-- The code in .then(*code here*) will wait for students to be gotten, then execute -->

<!-- Two Proper Usage Examples -->
studentsCreate({name: "Students name"})
  .then((createdStudent) => {
      // Do something with createdStudent data
  })
  .catch((err) => {
      // handle error here
      console.log(err);
  });


studentsReadAll()
  .then(resultsFromFunction => {
    let allStudents = resultsFromFunction";
    console.log(allStudents);   // prints list of student objects
    someFunction(allStudents);  // Works!
    ...
    ...
  })
  .catch((err) => {
    // handle error here
    console.log(err);
  });



<!-- Notes for group: -->
  - If you try to remove something from courses or students arrays and it doesn't exit, it won't tell you so make sure it was removed by hand checking

  - Made changes to course info, (no department or id, just course and courseName). Ex) course: "CS 1400",    courseName: "Databases for dummies"

  - The books attribute hasn't been enabled yet

  - Write function to verify proper course format before entering it in these function ex) "AB 1341" valid, "CS 123" not valid (for now space sensitive)

  - Write function to check classification to make sure it's [freshman, sophomore, junior, senior] before entering
    - Could give example when asking student for info (after receiving make it all lowercase or uppercase before entering)

  - In general, whenever handling user input, make sure it's valid. If it's not, tell the user how
    to make it valid or his options. Passing invalid or unexpected input to DB will cause error.

  - If course deleted, course probably needs to be removed from courses array for students
    - Ex) if student is being removed from course, we need to delete him from course, and course from student courses array. It doesn't happen automatically.
