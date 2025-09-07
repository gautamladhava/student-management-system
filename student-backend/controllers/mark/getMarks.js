const { Mark, Student, Subject } = require("../../models");

const getMarks = async (req, res) => {
  try {
    const marks = await Mark.findAll({
      attributes: [
        "id",
        "studentId",
        "subjectId",
        "marksObtained",
        "maxMarks",
        "examDate",
        "semester",
      ],
      include: [
        {
          model: Student,
          attributes: ["rollNo", "firstName", "lastName"],
        },
        {
          model: Subject,
          attributes: ["subjectCode", "subjectName"],
        },
      ],
    });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getMarks;
