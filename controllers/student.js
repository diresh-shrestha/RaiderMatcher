// jshint esversion: 8

  const mongoose = require('mongoose');
  const Student = require('../models/Student');

  /**
   * Creates a student object. Student name is required but all else optional.
   * Function will return created student object.
   * @param  {String}  name                REQUIRED
   * @param  {String}  [classification=""] OPTIONAL
   * @param  {String}  [major=""]          OPTIONAL
   * @param  {Boolean} [adminStatus=false] OPTIONAL
   * @param  {Array}   [courses=[]]        OPTIONAL
   * @return {Student Object}              Created student object returned
   *
   * @example creates and prints the student object after creation to console
   * studentsCreate({ name: "John Doe" }).then(createdStudent => console.log(createdStudent));
   *
   * @example creates student object with major and classification
   * studentsCreate({studentsCreate({ name: "Big Mac", classification: "Sophomore", major: "Business", adminStatus: true});
   */
  const studentsCreate = async function({
    name,
    classification="",
    major="",
    adminStatus=false,
    courses=[],
  } = {}) {

      if (!name) {
        return "Error - Name must be included when using studentsCreate." +
        " Also, make sure proper types passed for student attrubutes.";
      }

      return await Student.create({
          name: name,
          classification: classification,
          major: major,
          adminStatus: adminStatus,
          courses: courses
      });

  };

  /**
   * This function simply reads all the created students, regardless of course.
   * If err it will log error and return nothing.
   * @return {List of Student Objects}
   *
   * @example returns student objects and passes them to a function
   * studentsReadAll().then(students => sendStudentsToBot(students));
   */
  const studentsReadAll = async function() {
    return await Student
      .find()
      .populate({
        path:"courses",
        model:"Course"
      })
      .exec()
      .then((foundStudents) => {
        if (!foundStudents) {
          return "No students in collection";
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
  const studentsDeleteAll = function() {
    Student.remove({}, function(err) {
      if (err) {
        console.log(err);
        return;
      }
      else {
        console.log("All students deleted.");
        return null;
      }
    });
  };

  /**
   * Returns a single student object given the student's id.
   * @param  {String} studentId [description]
   * @return {Student object}
   *
   * @example printing a student
   * studentsReadOne("5f83a43e34c3da04908d4d89").then(student => console.log(student));
   */
  const studentsReadOne = function(studentId) {
    if (mongoose.Types.ObjectId.isValid(studentId)) {
      return Student
        .findById(mongoose.Types.ObjectId(studentId))
        .populate({
          path:"courses",
          model:"Course"
        })
        .exec()
        .then(function(foundStudent) {
          if (!foundStudent) {
            console.log("Error - Cannot find student with id: " + studentId);
            return "Error - Cannot find student with id: " + studentId;
          } else {
            return foundStudent;
          }
        });
    } else {
      console.log("Error - Proper Id not passed to studentsReadOne. Returned -1");
      return -1;
    }
  };

  /**
   * This function is the one handle all function for updating a student object.
   * The only required paramater is the id of the student being updated.
   * @param  {[type]}  studentId
   * @param  {String}  [newStudentName=""]
   * @param  {String}  [newStudentClassification=""]
   * @param  {String}  [newStudentMajor=""]
   * @param  {Boolean} [toggleAdminStatus=false]    Toggle Admin status
   * @param  {Boolean} [deleteCourses=false]        Deletes all the courses in the "courses" array for student.
   *                                                This will not delete the courses themselves
   *
   * @param  {[type]}  [courseToRemoveId=null]      Remove a single course from student's courses array
   * @param  {[type]}  [courseToAddId=null]         Add a single course to the student's course array

   * @return {Student Object}                       Returns the updated student object
   *
   * @example student's name changed, admin status toggled, course is removed w/id "5f83a24bafc3b703ecde8c42"
   *       studentsUpdateOne({
             studentId: "5f83a43e34c3da04908d4d89",
             newStudentName: "Big Pack",
             toggleAdminStatus: true,
             courseToRemoveId: "5f83a24bafc3b703ecde8c42",
           });
   *
   */
  const studentsUpdateOne = function({
    studentId,
    newStudentName="",
    newStudentClassification="",
    newStudentMajor="",
    toggleAdminStatus=false,
    deleteCourses=false,
    courseToRemoveId=null,
    courseToAddId=null,
  } = {}) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      console.log("Error - Invalid Student ID passed to studentsUpdateOne");
      return;
    }

    Student
      .findById(mongoose.Types.ObjectId(studentId))
      .exec((err, foundStudent) => {
        if (!foundStudent) {
          console.log("Student does not exist. Cannot update.");
          return -1;
        } else if (err) {
          console.log(err);
          return -1;
        }

        if (newStudentName)
          foundStudent.name = newStudentName;

        if (newStudentClassification)
          foundStudent.classification = newStudentClassification;

        if (newStudentMajor)
          foundStudent.major = newStudentMajor;

        if (toggleAdminStatus)
          foundStudent.adminStatus = !foundStudent.adminStatus;

        if (deleteCourses)
          foundStudent.courses = [];

        if (courseToRemoveId) {
          try {
            foundStudent.courses.pull({ _id: mongoose.Types.ObjectId(courseToRemoveId) });
          } catch (err) {
            console.log("Error removing course from student courses - Make sure string of course id passed and valid id");
            return -1;
          }
        }

        if (courseToAddId) {
          try {
            foundStudent.courses.push({ _id: mongoose.Types.ObjectId(courseToAddId) });
            // foundStudent.courses.push(courseToAddId);
          } catch (err) {
            console.log("Error - Make sure string of the course id passed and valid id");
            return -1;
          }
        }

        foundStudent.save().then(function(updatedStudent) {
          console.log(updatedStudent);
          return 0;
        });

      });
  };

  /**
   * Deletes a single student object from student collection.
   * @param  {String} studentId
   * @return {null}
   */
  const studentsDeleteOne = function(studentId) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      console.log("Error - Invalid Student ID passed to studentsDeleteOne");
      return;
    }

    Student
      .findByIdAndRemove(studentId)
      .exec((err, deletedStudent) => {
        if (err) {
          return err;
        } else if (!deletedStudent) {
          console.log("StudentId doesn't exist. Cannot remove student which doesn't exist.");
        } else {
          console.log("Student Deleted");
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
