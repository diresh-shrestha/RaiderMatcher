# RaiderMatcher

A **discord bot** for college students.


# RaiderMatcherDB Quick Start Guide


## Setting up MongoDB

STARTING MongoDB for mongoose (MUST DO THIS BEFORE ACCESSING DATABASE) 
Look up link to set up mongodb
[Installing mongodb](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials)


```
npm init -y
npm install mongodb --save
npm install mongoose
mongod   // Run this once before accessing database or functions and it will work until ctrl + c
```
<<ctrl+c to exit>>

>NOTE: You can open another terminal and do other things in that while mongod runs 
## Using the DB

May need to require mongoose, but most functionality should be outsourced to separate DB files 
`const mongoose = require('mongoose');`

Getting the functionality from the two collections:
```
const ctrlCourse = require('./controllers/course');     // Your path may be different 
const ctrlStudent = require('./controllers/student');   // Your path may be different 

const studentsCreate = ctrlStudent.studentsCreate;
const studentsReadAll = ctrlStudent.studentsReadAll;
const studentsDeleteAll = ctrlStudent.studentsDeleteAll;
const coursesReadOne = ctrlStudent.studentsReadOne;
const coursesUpdateOne = ctrlStudent.studentsUpdateOne;
const coursesDeleteOne = ctrlStudent.studentsDeleteOne;
```
If you need to create a object for example purposes or testing your functionality
you can use the functions above, or use the models and make them by hand if comfortable
with mongoose
```
const Course = require('./models/Course');
const Student = require('./models/Student');

const new_course = new Course({ course: "CS 4000" });
new_course.save();
```
When using the getter functions, save functions, anything that return something like functions
above, these will not return the results needed before next lines of code. Getting stuff from
database takes time.

These functions should follow below format when you want to use their returned values:
```
studentsReadOne()
studentsRealAll()
studentsCreate()

coursesReadOne()
coursesRealAll()
coursesCreate()
```
Wrong Usage Example:
```
let allStudents = studentsReadAll();
console.log(allStudents);  // prints "undefined"
someFunction(allStudents);     // Throws error and crashes because students weren't gotten in time
 ```
 Instead, you must let it finish and after use the ".then()" syntax
 The code in .then(*code here*) will wait for students to be gotten, then execute:

Two proper usage examples:
>Note: The .catch() part is safe but most errors should already be handled so not too important 
 ```
const studentDiscordTag = message.member.user.tag;
studentsCreate({ studentTag: studentDiscordTag })
  .then((createdStudent) => {
      // Do something with createdStudent data
  })
  .catch((err) => {
      // handle error here
      console.log(err);
  });
  
studentsReadAll()
  .then(resultsFromFunction => {
    let allStudents = resultsFromFunction";
    console.log(allStudents);   // prints list of student objects
    someFunction(allStudents);  // Works!
    ...
    ...
  })
  .catch((err) => {
    // handle error here
    console.log(err);
  });
  ```

## Changes & Notes

  - Made changes to course info, (no department or id, just course and courseName). Ex) course: "CS 1400",    courseName: "Databases for dummies"

  - The books attribute hasn't been enabled yet so don't use it for anything or worry about it

  - Write function to verify proper course format before entering it in these function ex) "AB 1341" valid, "CS 123" not valid
    - Also note the input is space sensitive

  - Write function to check classification to make sure it's [freshman, sophomore, junior, senior] before entering
    - Could give example when asking student for info (after receiving make it all lowercase or uppercase before entering)

  - In general, whenever handling user input, make sure it's valid. If it's not, tell the user how
    to make it valid or his other options. Passing invalid or unexpected input to DB will cause search problems later.

  - If course deleted, course probably needs to be removed from courses array for students
    - Ex) if student is being removed from course, we need to delete him from course, and course from student courses array. It doesn't happen automatically.

 Remove student from course :
    `coursesUpdateOne({ course: "CS 1400", studentToRemoveTag: "DISCORDID1" });`
    Now we must remove course from students courses
   ` studentsUpdateOne({ courseToRemove: "CS 1400", studentTag: "DISCORDID2" });`

