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
  aliases: ['addcourses', 'addCourses', 'Addcourses', 'addcourse', 'addCourse', 'Addcourse'],
  args: true,
  execute(message, args) {
    const course = args.join(' ');
    const channel = `${args[0]}-${args[1]}`;
    const studentTag = message.member.user.tag;
    // get the Courses channel category
    const category = message.guild.channels.cache.find(
      (c) => c.name === 'Courses'
    );
    // if the category doesn't exist, throw error
    if (!category) throw new Error('Category channel does not exist');

    // if the channel already doesn't exist
    if (
      !message.guild.channels.cache.find(
        (c) => c.name === channel.toLowerCase()
      )
    ) {
      // create a text channel with the name of the course
      message.guild.channels.create(course, 'text').then((createdChannel) => {
        // inside the Courses category
        createdChannel.setParent(category.id);
        console.log(`${channel} created inside the ${category} category`);
      });
    } else {
      // if the channel already exists, don't create a new channel
      console.log(`${channel} already exists`);
    }

    /* guild.channels
      .create(course, {
        type: 'text',
      })
      .then((channel) => {
        console.log(channel);
      }); */
    // Save this student once to test
    // studentsCreate( {studentTag: studentTag} ).then((createdStudent) => {
    //   console.log(createdStudent);
    // });

    message.channel.send(
      `You wrote the course ${course}\n${course} has been added! `
    );

    studentsReadOne(studentTag).then((foundStudent) => {
      coursesReadOne({ course })
        .then((foundCourse) => {
          // const role = message.guild.roles.find(role => role.name === foundCourse.courseName);
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
  },
};
