// jshint esversion: 8

const {
  coursesUpdateOne,
  coursesReadOne,
  coursesCreate,
} = require('../controllers/course');
const {
  studentsUpdateOne,
  studentsReadOne,
} = require('../controllers/student');
const Course = require('../models/Course');

module.exports = {
  name: 'add-courses',
  description: 'Add courses to the database',
  aliases: ['addcourses', 'addCourse', 'addcourse'],
  args: true,
  execute(message, args) {
    const course = args.join(' ');
    const studentTag = message.member.user.tag;

    // Save this student once to test
    // studentsCreate( {studentTag: studentTag} ).then((createdStudent) => {
    //   console.log(createdStudent);
    // });

    message.channel.send(`You wrote the course ${course}`);

    studentsReadOne(studentTag).then((foundStudent) => {
      coursesReadOne({ course })
        .then((foundCourse) => {
          if (!foundCourse) {
            coursesCreate({ course })
              .then((createdCourse) => {
                // add course to student courses array
                studentsReadOne({ studentTag }).then((res) => console.log(res));

                // add student to course students array
                coursesUpdateOne({
                  course,
                  studentToAddId: String(foundStudent._id),
                });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            // add course to student courses
            studentsUpdateOne({
              studentTag,
              courseToAddId: String(foundCourse._id),
            });

            // add student to course's student array
            if (!foundCourse.students.includes(String(foundStudent._id))) {
              coursesUpdateOne({
                course,
                studentToAddId: String(foundStudent._id),
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });

    /* new_course.save( (err) => {
            if (err) {
                console.log("error saving this test course: ");
                console.log(err);
              } else {
                studentsReadAll().then((response) => {
                    response.forEach((item) => {
                        if (item.name === userName) {
                            studentsUpdateOne({studentId: item._id, courseToAddId: new_course._id});

                        }
                    })
                })
            } */

    // coursesReadOne({course: courseName}).then(foundCourse => {
    //     console.log(foundCourse.students);
    // });
  },
};

/* studentsReadAll().then((response) => {
                response.forEach((item) => {
                    if (item.name === userName) {
                        studentsUpdateOne({studentId: item._id, courseToAdd: foundCourse._id});

                    }
                })
            });
        */
/* coursesReadOne({course: courseName}).then(foundCourse => {
            studentsReadAll().then((response) => {
                response.forEach((item) => {
                    if (item.name === userName) {
                        studentsUpdateOne({studentId: item._id, courseToAdd: foundCourse._id});

                    }
                })
            });
        }); */
/*
        const studentId = studentsReadAll().then((response) => {
            response.forEach((item) => {
                if (item.name === userName.toLowerCase()) {
                    return item._id;
                }
            })
        }
         */
/* coursesReadAll().then((response) => {
            response.forEach((c) => {
                if (c.course === courseName) {
                    console.log(c.course);
                     const cId = String(c._id);
                     console.log(cId);
                }
            })
        }) */

/* coursesUpdateOne({courseId: cId, studentToAddId: sId}); */
// coursesReadAll().then(response => console.log(response));
// studentsReadAll().then(response => console.log(response));

/*     })
    }
}; */
