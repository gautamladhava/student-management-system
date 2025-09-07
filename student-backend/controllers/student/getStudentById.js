const { Student } = require("../../models");

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id, {
      attributes: [
        "id",
        "rollNo",
        "firstName",
        "lastName",
        "email",
        "dateOfBirth",
      ],
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getStudentById;
