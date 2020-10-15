// jshint esversion: 8

// This file is not necessary for database to work. This is for express/node js
// paths. Look up the "router express" functionality if you wanna use this later.
const express = require('express');
const router = express.Router();
const ctrlCourse = require('../controllers/course');
const ctrlStudent = require('../controllers/student');

// courses
router
  .route('/courses')
  .get(ctrlCourse.coursesReadAll)
  .post(ctrlCourse.coursesCreate)
  .delete(ctrlCourse.coursesDeleteAll);

router
  .route('/courses/:courseid')
  .get(ctrlCourse.coursesReadOne)
  .put(ctrlCourse.coursesUpdateOne)
  .delete(ctrlCourse.coursesDeleteOne);

// students
router
  .route('/students')
  .get(ctrlStudent.studentsReadAll)
  .post(ctrlStudent.studentsCreate)
  .delete(ctrlStudent.studentsDeleteAll);

router
  .route('/students/:studentid')
  .get(ctrlStudent.studentsReadOne)
  .put(ctrlStudent.studentsUpdateOne)
  .delete(ctrlStudent.studentsDeleteOne);


module.exports = router;
