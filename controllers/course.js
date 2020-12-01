// jshint esversion: 6

const mongoose = require('mongoose');
const Course = require('../models/Course');
const { studentsReadOne } = require('./student');

/**
 * The coursesCreate function will create a single course in raiderMatcher DB.
 * It will return the created course object. If course is already in DB, Validation
 * error is returned.
 * @param  {String} course          The course. Ex) "CS 1400" (REQUIRED)
 * @param  {String} [courseName=""] The course name. Ex) "Intro to Algorithms" (OPTIONAL)
 * @param  {Array}  [students=[]]   Array of students. (OPTIONAL)
 * @return {Course Object}          It will return the created course. (OPTIONAL)
 *
 * @example creates and prints the course object after creation to console
 * coursesCreate({ course: "CS 1400" }).then(createdCourse => console.log(createdCoursse));
 */
const coursesCreate = async function ({
  course,
  courseName = '',
  students = [],
} = {}) {
  if (course) {
    course = course.toUpperCase();
    try {
      return await Course.create({
        course,
        courseName,
        students,
      });
    } catch (err) {
      console.log('Error in coursesCreate. Most likely Duplicated course');
      // console.log(err);
      return -1;
    }
  } else {
    console.log('Course parameter not entered in coursesCreate');
    return -1;
  }
};

/**
 * The coursesReadAll will returned an array of all courses. If no courses,
 * returns empty array.
 * @return {Array of Courses} [description]
 */
const coursesReadAll = async function () {
  return await Course.find()
    .populate('students')
    .exec()
    .then((foundCourses) => {
      if (!foundCourses) {
        return 'No courses in collection';
      }
      return foundCourses;
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * This will simply delete all courses in Database. Caution when using this.
 * @return {null}
 */
const coursesDeleteAll = function () {
  return Course.deleteMany({}, function (err) {
    if (err) {
      return err;
    }
    console.log('All courses deleted.');
    return null;
  });
};

/**
 * This function, given the course, will return the course object.
 *
 * @param  {String} [course]      The course. Ex) "CS 1400"
 * @return {Course}               Returns a course object.
 *
 * @example
 * coursesReadOne(course).then(foundCourse => console.log(foundCourse));
 * // Prints the found course
 *
 * @example
 * coursesReadOne(course).then(foundCourse => sendResponseToUI(response));
 * // Found course is passed to some other written function "sendResponseToUI"
 */
const coursesReadOne = function (course) {
  if (!course) {
    console.log('Error - Must pass course in coursesReadOne');
    return -1;
  }

  // console.log(course);
  const conditions = { course: course.toUpperCase() };

  return (
    Course.findOne(conditions)
      .populate('students')
      // .populate({
      //   path:"students",
      //   model:"Student"
      // })
      .exec()
      .then(function (foundCourse) {
        if (!foundCourse) {
          console.log('Cannot find course in coursesReadOne.');
          return null;
        }
        return foundCourse;
      })
  );
};

/**
 * The coursesUpdateOne function updates a single course given the course.
 * It can rename course and/or courseName, it can delete students from course,
 * it can delete single student from course given student id, or it can add student
 * given a student name. The function will print the error if error, updated
 * course if success.
 * @param  {String}  course                  REQUIRED
 * @param  {String}  [newCourseValue=""]     OPTIONAL
 * @param  {String}  [newCourseName=""]      OPTIONAL
 * @param  {Boolean} [deleteStudents=false]  OPTIONAL - Deletes all students when true
 * @param  {String}  [studentToRemoveTag=""]  OPTIONAL
 * @param  {String}  [studentToAddTag=""]   OPTIONAL - Should be valid Student object
 * @return {Number}                          Returns 0 if success, -1 for err.
 *
 * @example
 *
 *   // Adding new student to course
 *   coursesUpdateOne({ course: "CS 1400", studentToAddTag: "DogSniffer#0021" });
 *
 * @example
 *   // Changing course value to "CS 1472", changing or adding courseName "Algo"
 *   coursesUpdateOne({ course: "CS 1400", newCourseValue: "CS 1472", newCourseName: "Algo"});
 *
 */
const coursesUpdateOne = async function ({
  course,
  newCourseValue = '',
  newCourseName = '',
  deleteStudents = false,
  studentToRemoveTag = '',
  studentToAddTag = '',
} = {}) {
  if (!course) {
    // course validity function here
    console.log('Error - Course must be passed to coursesUpdateOne');
    return 'Error - Course must be passed to coursesUpdateOne';
  }
  Course.findOne({ course }, function (err, foundCourse) {
    if (!foundCourse) {
      console.log('Course does not exist. Cannot update.');
      return -1;
    }
    if (err) {
      console.log(err);
      return -1;
    }
    if (newCourseValue) foundCourse.course = newCourseValue;

    if (newCourseName) foundCourse.courseName = newCourseName;

    if (deleteStudents) foundCourse.students = [];

    if (studentToRemoveTag) {
      try {
        studentsReadOne(studentToRemoveTag).then((foundStudent) => {
          foundCourse.students.pull({ _id: foundStudent._id });

          // Save
          foundCourse.save((err, updatedCourse) => {
            if (err) {
              console.log(err);
              return -1;
            }
            console.log('Removed Student: (if student existed in array)');
            console.log(updatedCourse);
          });
        });
      } catch (err) {
        console.log(
          "Error removing student from a course's students in coursesUpdateOne"
        );
        console.log(err);
        return -1;
      }
    }

    if (studentToAddTag) {
      // find this student in DB and then pass id to push
      studentsReadOne(studentToAddTag).then((foundStudent) => {
        if (foundStudent) {
          foundCourse.students.addToSet(foundStudent._id);
        } else {
          console.log(`Student does not  exist: ${studentToAddTag}`);
        }
        // Save after pushing student
        foundCourse.save((err, updatedCourse) => {
          if (err) {
            console.log(err);
            return -1;
          }
          console.log('Added Student (if not already there): ');
          console.log(updatedCourse);
        });
      });
    }

    if (!studentToRemoveTag && !studentToAddTag) {
      // If no changes to students array being made, save course here
      foundCourse.save((err, updatedCourse) => {
        if (err) {
          console.log(err);
          return -1;
        }
        console.log(updatedCourse);
      });
    }
  });

  return 0;
};

/**
 * Deletes a single course given course. If courses doesn't exist, nothing
 * will happen exist a "Course Deleted" message will appear on console.
 * @param  {String} course  REQUIRED
 * @return {null}
 */
const coursesDeleteOne = function (course) {
  if (course) {
    Course.deleteOne({ course }).exec((err, deletedCourse) => {
      if (err) {
        console.log(err);
      } else if (!deletedCourse) {
        // This doesn't work because
        console.log(
          "Error - Course doesn't exist so can't delete in coursesDeleteOne"
        );
      } else {
        console.log('Course Deleted');
        return null;
      }
    });
  } else {
    console.log("Error - Course isn't passed in coursesDeleteOne");
  }
};

module.exports.coursesReadAll = coursesReadAll;
module.exports.coursesCreate = coursesCreate;
module.exports.coursesDeleteAll = coursesDeleteAll;

module.exports.coursesReadOne = coursesReadOne;
module.exports.coursesUpdateOne = coursesUpdateOne;
module.exports.coursesDeleteOne = coursesDeleteOne;
