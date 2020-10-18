const {
  studentsReadOne,
  studentsUpdateOne,
} = require('../controllers/student');

module.exports = {
  name: 'add-classification',
  description: "Adds a student's classification to the student database",
  aliases: ['addclassification', 'addClassification'],
  usage: 'Freshman/Sophomore/Junior/Senior',
  args: true,
  execute(message, args) {
    const studentTag = message.member.user.tag;
    const classification = args.join(' ');
    studentsReadOne(studentTag).then((foundStudent) => {
      if (!foundStudent.classification) {
        studentsUpdateOne({
          studentTag,
          newStudentClassification: classification,
        });
        console.log('Classification successfully added!');
        console.log(foundStudent);
        message.reply(`Your classification: ${classification} was just added!`);
      } else {
        message.reply('Your classification is already in the database');
        console.log('Classification already exists in the database');
      }
    });
  },
};
