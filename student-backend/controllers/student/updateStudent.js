const { Student } = require("../../models");

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { rollNo, firstName, lastName, email, dateOfBirth } = req.body;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.update({
      rollNo,
      firstName,
      lastName,
      email,
      dateOfBirth,
    });

    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = updateStudent;
