const { Subject } = require("../../models");

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      attributes: [
        "id",
        "subjectCode",
        "subjectName",
        "description",
        "credits",
      ],
    });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getSubjects;
