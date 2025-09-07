const { Subject } = require("../../models");

const createSubject = async (req, res) => {
  try {
    const { subjectCode, subjectName, description, credits } = req.body;

    const subject = await Subject.create({
      subjectCode,
      subjectName,
      description,
      credits,
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = createSubject;
