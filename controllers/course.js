// jshint esversion: 6

  const mongoose = require('mongoose');
  const Course = require('../models/Course');

/**
 * The coursesCreate function will create a single course in raiderMatcher DB.
 * It will return the created course object. If course is already in DB, Validation
 * error is returned.
 * @param  {String} course          The course. Ex) "CS 1400" (REQUIRED)
 * @param  {String} [courseName=""] The course name. Ex) "Intro to Algorithms" (OPTIONAL)
 * @param  {Array}  [books=[]]      Array of course textbooks. Ex) ["Book 3rd Edition"] (OPTIONAL)
 * @param  {Array}  [students=[]]   Array of students. (OPTIONAL)
 * @return {Course Object}          It will return the created course. (OPTIONAL)
 *
 * @example creates and prints the course object after creation to console
 * coursesCreate({ name: "CS 1400" }).then(createdCourse => console.log(createdCoursse));
 */
  const coursesCreate = async function(course, courseName="", books=[], students=[]) {
    if (course) { // course validity check (this could be done before passing as well)
      return await Course.create({
        course: course,
        courseName: courseName,
        books: books,
        students: students
      });
    } else {
      return "Course parameter not entered";
    }
  };

  /**
   * The coursesReadAll will returned an array of all courses. If no courses,
   * returns empty array.
   * @return {Array of Courses} [description]
   */
  const coursesReadAll = async function() {
    return await Course
      .find()
      .populate('students')
      .exec()
      .then((foundCourses) => {
        if (!foundCourses) {
          return "No courses in collection";
        } else {
          return foundCourses;
        }
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  };

  /**
   * This will simply delete all courses in Database. Caution when using this.
   * @return {null}
   */
  const coursesDeleteAll = function() {
    return Course.remove({}, function(err) {
      if (err) {
        return err;
      }
      else {
        console.log("All courses deleted.");
        return null;
      }
    });
  };


  /**
   * This function will return a single course in courses collection. It takes either
   * the courseId or the course (Ex: "CS 1400") but NOT both.
   *
   * @param  {String} [courseId=""] The courseId. Ex) "5f82868fb49d7a7d6b627f11"
   * @param  {String} [course=""]   The course. Ex) "CS 1400"
   * @return {Course}               Returns a course object.
   *
   * @example
   * coursesReadOne({ courseId: '5f83665c4f4d4d03b19dab13' }).then(foundCourse => console.log(foundCourse));
   * // Prints the found course
   *
   * @example
   * coursesReadOne({ course: 'CS 1400' }).then(foundCourse => sendResponseToUI(response));
   * // Found course is passed to some other written function "sendResponseToUI"
   */
  const coursesReadOne = function({
    courseId="",
    course="",
  } = {}) {

    if (!courseId && !course) {
      console.log("ERROR - Must provide courseId or course to read course");
      return "ERROR - Must provide courseId or course to read course";
    } else if (courseId && course) {
      console.log("ERROR - Must pass courseId OR course, but not both");
      return "ERROR - Must pass courseId OR course, but not both";
    }

    if (courseId && !mongoose.Types.ObjectId.isValid(courseId)) {
      console.log("Error - Course ID is not of valid format");
    }

    let conditions;
    if (courseId)
      conditions = { _id: mongoose.Types.ObjectId(courseId)};
    else
      conditions = { course: course.toUpperCase() };

    return Course
      .findOne(conditions)
      .populate('students')
      // .populate({
      //   path:"students",
      //   model:"Student"
      // })
      .exec()
      .then(function(foundCourse) {
        if (!foundCourse) {
          console.log("Error - Cannot find course with that id or name.");
          return "Error - Cannot find course with that id or name.";
        } else {
          return foundCourse;
        }
      });
  };

  /**
   * The coursesUpdateOne function updates a single course given the courses id.
   * It can rename course and/or courseName, it can delete students from course,
   * it can delete single student from course given student id, or it can add student
   * given a student name. The function will print the error if error, updated
   * course if success.
   * @param  {String}  courseId                REQUIRED
   * @param  {String}  [newCourseValue=""]     OPTIONAL
   * @param  {String}  [newCourseName=""]      OPTIONAL
   * @param  {Boolean} [deleteStudents=false]  OPTIONAL - Deletes all students when true
   * @param  {String}  [studentToRemoveId=""]  OPTIONAL
   * @param  {String}  [studentToAddId=""]   OPTIONAL - Should be valid Student object
   * @return {Number}                          Returns 0 if success, -1 for err.
   *
   * @example
   *   const new_student_one = Student({ name: "John Doe" });
   *   new_student_one.save();
   *
   *   // Adding new student to course
   *   coursesUpdateOne({courseId: '5f83665c4f4d4d03b19dab14', studentToAddId: String(new_student_one._id});
   * 
   * @example
   *   // Changing course value to "CS 1472", changing or adding courseName "Algo"
   *   coursesUpdateOne({courseId: '5f83665c4f4d4d03b19dab14', newCourseValue: "CS 1472", newCourseName: "Algo"});
   *
   */
  const coursesUpdateOne = async function({
    courseId,
    newCourseValue="",
    newCourseName="",
    deleteStudents=false,
    studentToRemoveId="",
    studentToAddId="",
  } = {}) {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {  // course validity function here
      return "Error - Course ID not valid passed to coursesUpdateOne";
    }
    Course
      .findById(mongoose.Types.ObjectId(courseId), function(err, foundCourse) {
        if (!foundCourse) {
          console.log("Course does not exist. Cannot update.");
          return -1;
        } else if (err) {
          console.log(err);
          return -1;
        } else {
          if (newCourseValue)
            foundCourse.course = newCourseValue;

          if (newCourseName)
            foundCourse.courseName = newCourseName;

          if (deleteStudents)
            foundCourse.students = [];

          if (studentToRemoveId) {
            try {
              foundCourse.students.pull({ _id: mongoose.Types.ObjectId(studentToRemoveId) });
            } catch (err) {
              console.log("Error removing student from course - Make sure string of student id passed and valid id");
              return -1;
            }
          }

          if (studentToAddId) {
            try {
              foundCourse.students.push(mongoose.Types.ObjectId(studentToAddId));
            } catch (err) {
              console.log("Error - student id probably wasn't valid");
              return -1;
            }
          }

          foundCourse.save((err, updatedCourse) => {
            if (err) {
              console.log(err);
              return -1;
            } else {
              console.log(updatedCourse);
            }
          });
        }
      });

      return 0;
  };

  /**
   * Deletes a single course given course id.
   * @param  {String} courseId  REQUIRED
   * @return {null}
   */
  const coursesDeleteOne = function(courseId) {
    if (mongoose.Types.ObjectId.isValid(courseId)) {   // course validity check
      Course
        .findByIdAndRemove(mongoose.Types.ObjectId(courseId))
        .exec((err, foundCourse) => {
          if (err) {
            console.log(err);
          } else if (!foundCourse) {
            console.log("Error - Course ID doesn't exist in coursesDeleteOne");
          } else {
            return null;
          }
        });
    } else {
      console.log("Error - Course ID isn't of valid form in coursesDeleteOne");
    }
  };


  module.exports.coursesReadAll = coursesReadAll;
  module.exports.coursesCreate = coursesCreate;
  module.exports.coursesDeleteAll = coursesDeleteAll;

  module.exports.coursesReadOne = coursesReadOne;
  module.exports.coursesUpdateOne = coursesUpdateOne;
  module.exports.coursesDeleteOne = coursesDeleteOne;
