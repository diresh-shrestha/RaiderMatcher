// jshint esversion: 8

const mongoose = require('mongoose');
const Student = require('../models/Student');
// const { coursesReadOne } = require("./course");

/**
 * Creates a student object. Student Tag from discord is required but all
 * else optional. Function will return created student object.
 * @param  {String}  studentTag          REQUIRED - Student's discord tag
 * @param  {String}  name                optional
 * @param  {String}  [classification=""] OPTIONAL
 * @param  {String}  [major=""]          OPTIONAL
 * @param  {Boolean} [adminStatus=false] OPTIONAL
 * @param  {Array}   [courses=[]]        OPTIONAL
 * @return {Student Object}              Created student object returned
 *
 * @example creates and prints the student object after creation to console
 * const studentDiscordTag = message.member.user.tag;
 * studentsCreate({ studentTag: studentDiscordTag }).then(createdStudent => console.log(createdStudent));
 *
 * @example creates student object with name, major and classification
 * studentsCreate({ studentTag: studentDiscordTag, name: "Big Mac", classification: "Sophomore", major: "Business", adminStatus: true});
 */
const studentsCreate = async function ({
  studentTag,
  name = '',
  classification = '',
  major = '',
  adminStatus = false,
  courses = [],
} = {}) {
  if (!studentTag) {
    return 'Error - studentTag must be included when using studentsCreate.';
  }
  try {
    return await Student.create({
      studentTag: studentTag,
      name: name,
      classification: classification,
      major: major,
      adminStatus: adminStatus,
      courses: courses,
    });
  } catch (err) {
    console.log(
      'Error creating student - Student Tag most likely already exists in DB'
    );
    // console.log(err);
    console.log(String(err).slice(0, 200) + '...');
    return null;
  }
};

/**
 * This function simply reads all the created students, regardless of course.
 * If err it will log error and return nothing.
 * @return {List of Student Objects}
 *
 * @example returns student objects and passes them to a function
 * studentsReadAll().then(students => sendStudentsToBotOrSomething(students));
 */
const studentsReadAll = async function () {
  return await Student.find()
    .populate({
      path: 'courses',
      model: 'Course',
    })
    .exec()
    .then((foundStudents) => {
      if (!foundStudents) {
        return 'No students in collection';
      } else {
        return foundStudents;
      }
    })
    .catch((err) => {
      console.log(err);
      return;
    });
};

/**
 * Deletes all students, regardless of course. Careful using this function in production.
 * @return {null}
 */
const studentsDeleteAll = function () {
  Student.deleteMany({}, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log('All students deleted.');
      return null;
    }
  });
};

/**
 * Returns a single student object given the student's tag.
 * @param  {String} studentTag
 * @return {Student object}
 *
 * @example printing a student
 * const studentDiscordTag = message.member.user.tag;
 * studentsReadOne(studentDiscordTag).then(student => console.log(student));
 */
const studentsReadOne = function (studentTag) {
  if (studentTag) {
    return Student.findOne({ studentTag: studentTag })
      .populate({
        path: 'courses',
        model: 'Course',
      })
      .exec()
      .then(function (foundStudent) {
        if (!foundStudent) {
          console.log('Error - Cannot find student with tag: ' + studentTag);
          return null;
        } else {
          return foundStudent;
        }
      });
  } else {
    console.log(
      'Error - Student Tag must be included in studentsReadOne arguments. Returned -1'
    );
    return -1;
  }
};

/**
   * This function is the one handle all function for updating a student object.
   * The only required paramater is the student tag of the student being updated.
   * @param  {String}  studentTag                   REQUIRED
   * @param  {String}  [newStudentName=""]
   * @param  {String}  [newStudentClassification=""]
   * @param  {String}  [newStudentMajor=""]
   * @param  {Boolean} [toggleAdminStatus=false]    Toggle Admin status
   * @param  {Boolean} [deleteCourses=false]        Deletes all the courses in the "courses" array for student.
   *                                                NOTE: This will not delete the courses themselves
   *
   * @param  {[type]}  [courseToRemove=""]      Remove a single course from student's courses array
   * @param  {[type]}  [courseToAdd=""]         Add a single course to the student's course array

   * @return {Student Object}                       Returns the updated student object
   *
   * @example student's name changed, admin status toggled, course "CS 1400" is removed from student courses"
   *       studentsUpdateOne({
             studentTag: studentTagVariable,
             newStudentName: "Big Pack",
             toggleAdminStatus: true,
             courseToRemove: "CS 1400",
           });
   *
   */
const studentsUpdateOne = function ({
  studentTag,
  newStudentName = '',
  newStudentClassification = '',
  newStudentMajor = '',
  toggleAdminStatus = false,
  deleteCourses = false,
  courseToRemove = '',
  courseToAdd = '',
} = {}) {
  if (!studentTag) {
    console.log('Error - Student Tag must be passed to studentsUpdateOne');
    return;
  }

  Student.findOne({ studentTag: studentTag }).exec((err, foundStudent) => {
    if (!foundStudent) {
      console.log('Student does not exist. Cannot update.');
      return -1;
    } else if (err) {
      console.log(err);
      return -1;
    }

    if (newStudentName) foundStudent.name = newStudentName;

    if (newStudentClassification)
      foundStudent.classification = newStudentClassification;

    if (newStudentMajor) foundStudent.major = newStudentMajor;

    if (toggleAdminStatus) foundStudent.adminStatus = !foundStudent.adminStatus;

    if (deleteCourses) {
      foundStudent.courses = [];
    }

    if (courseToRemove) {
      try {
        coursesReadOne(courseToRemove).then((foundCourse) => {
          if (foundCourse) {
            foundStudent.courses.pull({ _id: foundCourse._id });

            foundStudent.save(function (err, updatedStudent) {
              if (err) {
                console.log(err);
                return -1;
              } else {
                console.log('Removed Course: (if course existed in array)');
                console.log(updatedStudent);
              }
            });
          }
        });
      } catch (err) {
        console.log(
          "Error removing course from a student's courses in studentsUpdateOne"
        );
        console.log(err);
        return -1;
      }
    }

    if (courseToAdd) {
      // find the course in DB and then pass id to push
      coursesReadOne(courseToAdd).then((foundCourse) => {
        if (foundCourse) {
          foundStudent.courses.addToSet(foundCourse._id);

          foundStudent.save(function (err, updatedStudent) {
            if (err) {
              console.log(err);
              return -1;
            } else {
              console.log("Added Course: (if course wasn't already in array)");
              console.log(updatedStudent);
            }
          });
        } else {
          console.log('Course does not  exist: ' + courseToAdd);
        }
      });
    }

    if (!courseToAdd && !courseToRemove) {
      foundStudent.save().then(function (updatedStudent) {
        console.log(updatedStudent);
        return 0;
      });
    }
  });
};

/**
 * Deletes a single student object from student collection. If course doesn't
 * exist, it will still print "Student Deleted".
 * @param  {String} studentTag
 * @return {null}
 */
const studentsDeleteOne = function (studentTag) {
  if (!studentTag) {
    console.log('Error - Student Tag must be passed in studentsDeleteOne');
    return;
  }

  Student.deleteOne({ studentTag: studentTag }).exec((err, deletedStudent) => {
    if (err) {
      return err;
    } else if (!deletedStudent) {
      console.log(
        "StudentTag doesn't exist. Cannot remove student which doesn't exist."
      );
    } else {
      console.log('Student Deleted');
      return null;
    }
  });
};

module.exports.studentsReadAll = studentsReadAll;
module.exports.studentsCreate = studentsCreate;
module.exports.studentsDeleteAll = studentsDeleteAll;

module.exports.studentsReadOne = studentsReadOne;
module.exports.studentsUpdateOne = studentsUpdateOne;
module.exports.studentsDeleteOne = studentsDeleteOne;
