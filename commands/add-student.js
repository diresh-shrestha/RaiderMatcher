const {
  studentsReadOne,
  studentsCreate,
  studentsDeleteAll,
} = require('../controllers/student');

module.exports = {
  name: 'add-student',
  description: 'Adds student to the student database',
  aliases: [
    'addstudent',
    'addstudents',
    'Addstudent',
    'addStudents',
    'add-students',
  ],
  usage: 'FirstName LastName',
  args: true,
  execute(message, args) {
    const studentTag = message.member.user.tag;
    const studentName = args.join(' ');
    studentsReadOne(studentTag).then((foundStudent) => {
      if (!foundStudent) {
        studentsCreate({ studentTag: studentTag, name: studentName }).then(
          (createdStudent) => {
            console.log('Student successfully added!');
            console.log(createdStudent);
            message.reply('Awesome! You were just added.');
          }
        );
      } else {
        message.reply('You are already in the database');
        console.log(`${studentTag} already exists in the database`);
      }
    });
  },
};
