const { Mark } = require("../../models");

const updateMark = async (req, res) => {
  try {
    const { id } = req.params;
    const { marksObtained, maxMarks, examDate, semester } = req.body;

    const mark = await Mark.findByPk(id);
    if (!mark) {
      return res.status(404).json({ message: "Mark not found" });
    }

    await mark.update({
      marksObtained,
      maxMarks,
      examDate,
      semester,
    });

    res.json(mark);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = updateMark;
