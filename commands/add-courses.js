const { coursesUpdateOne, coursesReadAll, coursesReadOne } = require("../controllers/course");
const { studentsReadAll, studentsDeleteAll, studentsCreate, studentsUpdateOne } = require("../controllers/student");
const Course = require('../models/Course');


module.exports = {
    name: 'add-courses',
    description: 'Add courses to the database',
    aliases: ['addcourses', 'addCourse', 'addcourse'],
    args: true,
    execute(message, args) {
        const userName = message.author.username;
        const courseName = args.join(' ');
        //const new_course = new Course({ course: courseName});
        
        message.channel.send(`You wrote the course ${courseName}`);
        
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
            coursesReadOne({course: courseName}).then(foundCourse => {
                console.log(foundCourse.students);
            });
        }
    }
        
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
        
        /* coursesUpdateOne({courseId: cId, studentToAddId: sId});*/
        //coursesReadAll().then(response => console.log(response));   
        //studentsReadAll().then(response => console.log(response));
        
 /*     })
    }
}; */

