const { Subject } = require("../../models");

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectCode, subjectName, description, credits } = req.body;

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await subject.update({
      subjectCode,
      subjectName,
      description,
      credits,
    });

    res.json(subject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = updateSubject;
