const { Subject } = require("../../models");

const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findByPk(id, {
      attributes: [
        "id",
        "subjectCode",
        "subjectName",
        "description",
        "credits",
      ],
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getSubjectById;
