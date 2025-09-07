const { Student } = require("../../models");

const createStudent = async (req, res) => {
  try {
    const { rollNo, firstName, lastName, email, dateOfBirth } = req.body;

    const student = await Student.create({
      rollNo,
      firstName,
      lastName,
      email,
      dateOfBirth,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = createStudent;
