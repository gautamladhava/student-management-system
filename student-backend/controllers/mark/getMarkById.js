const { Mark, Student, Subject } = require("../../models");

const getMarkById = async (req, res) => {
  try {
    const { id } = req.params;

    const mark = await Mark.findByPk(id, {
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

    if (!mark) {
      return res.status(404).json({ message: "Mark not found" });
    }

    res.json(mark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getMarkById;
