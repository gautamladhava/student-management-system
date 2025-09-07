const Student = require("./student");
const Subject = require("./subject");
const Mark = require("./mark");

Student.hasMany(Mark, {
  foreignKey: "studentId",
});
Mark.belongsTo(Student, {
  foreignKey: "studentId",
});

Subject.hasMany(Mark, {
  foreignKey: "subjectId",
});
Mark.belongsTo(Subject, {
  foreignKey: "subjectId",
});

module.exports = {
  Student,
  Subject,
  Mark,
};
