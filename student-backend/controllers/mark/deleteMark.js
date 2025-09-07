const { Mark } = require("../../models");

const deleteMark = async (req, res) => {
  try {
    const { id } = req.params;

    const mark = await Mark.findByPk(id);
    if (!mark) {
      return res.status(404).json({ message: "Mark not found" });
    }

    await mark.destroy();
    res.json({ message: "Mark deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteMark;
