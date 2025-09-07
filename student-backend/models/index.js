const Student = require("./student");
const Subject = require("./subject");
const Mark = require("./mark");

// Define relationships using primary keys
Student.hasMany(Mark, {
  foreignKey: "studentId", // Will be converted to student_id in DB
});
Mark.belongsTo(Student, {
  foreignKey: "studentId",
});

Subject.hasMany(Mark, {
  foreignKey: "subjectId", // Will be converted to subject_id in DB
});
Mark.belongsTo(Subject, {
  foreignKey: "subjectId",
});

module.exports = {
  Student,
  Subject,
  Mark,
};
