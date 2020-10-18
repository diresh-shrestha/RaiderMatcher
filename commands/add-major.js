const {
  studentsUpdateOne,
  studentsReadOne,
} = require('../controllers/student');

module.exports = {
  name: 'add-major',
  description: "Adds student's major to the student database",
  aliases: ['addmajor', 'addMajor', 'Addmajor'],
  usage: 'Computer Science',
  args: true,
  execute(message, args) {
    const studentTag = message.member.user.tag;
    const major = args.join(' ');
    studentsReadOne(studentTag).then((foundStudent) => {
      if (!foundStudent.major) {
        studentsUpdateOne({ studentTag: studentTag, newStudentMajor: major });
        message.reply('Your major has been added.');
      } else {
        message.reply('You have already added your major.');
        console.log(`Major already exists in the database`);
      }
    });
  },
};
