const {
  studentsReadOne,
  studentsCreate,
  studentsDeleteAll,
} = require('../controllers/student');

module.exports = {
  name: 'initial-start',
  description: 'Adds student to the student database',
  aliases: [
    'initialstart',
    'Initialstart',
    'initialStart',
    'InitialStart',
  ],
  usage: 'FirstName LastName, Classification, Major',
  args: true,
  execute(message, args) {
    const studentTag = message.member.user.tag;
    const fullMessage = message.toString();
    const nameIndex = fullMessage.indexOf(',');
    const classIndex = fullMessage.lastIndexOf(',');
    const studentName = fullMessage.substring(15, nameIndex);
    const classification = fullMessage.substring(nameIndex + 1, classIndex);
    const major = fullMessage.substring(classIndex + 1);
    studentsReadOne(studentTag).then((foundStudent) => {
      if (!foundStudent) {
        studentsCreate({ studentTag: studentTag, name: studentName, major: major, classification: classification }).then(
          (createdStudent) => {
            console.log('Student successfully created!');
            console.log(createdStudent);
            message.reply('Awesome! You were just registered.');
          }
        );
      } else {
        message.reply('You are already in the database');
        console.log(`${studentTag} already exists in the database`);
      }
    });
  },
};