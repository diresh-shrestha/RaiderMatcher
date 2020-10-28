const {
    studentsReadOne,
    studentsCreate,
    studentsDeleteAll,
} = require('../controllers/student');

module.exports = {
    name: 'initial-start',
    description: 'startup configuration for new users',
    execute(message, args) {
        message.channel.send('Welcome to RaiderMatcher!');
    },
};
