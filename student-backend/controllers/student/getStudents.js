const { Student } = require("../../models");

const getStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: [
        "id",
        "rollNo",
        "firstName",
        "lastName",
        "email",
        "dateOfBirth",
      ],
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getStudents;
