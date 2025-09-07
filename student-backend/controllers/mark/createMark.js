const { Mark, Student, Subject } = require("../../models");

const createMark = async (req, res) => {
  try {
    // Validate request body
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    const {
      studentId,
      subjectId,
      marksObtained,
      maxMarks,
      examDate,
      semester,
    } = req.body;

    // Validate required fields
    if (
      !studentId ||
      !subjectId ||
      !marksObtained ||
      !maxMarks ||
      !examDate ||
      !semester
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate marks range
    if (marksObtained < 0 || marksObtained > maxMarks) {
      return res.status(400).json({
        error: "Invalid marks range",
        details: "Marks obtained should be between 0 and max marks",
      });
    }

    // Validate exam date
    const examDateObj = new Date(examDate);
    if (isNaN(examDateObj.getTime())) {
      return res.status(400).json({ error: "Invalid exam date format" });
    }

    // Validate semester
    if (semester < 1 || semester > 8) {
      return res.status(400).json({
        error: "Invalid semester",
        details: "Semester should be between 1 and 8",
      });
    }

    // Check if mark already exists
    const existingMark = await Mark.findOne({
      where: { studentId, subjectId, semester },
    });

    if (existingMark) {
      return res.status(400).json({
        error:
          "Mark already exists for this student and subject in this semester",
        existingMark,
      });
    }

    // Verify student and subject exist
    const [student, subject] = await Promise.all([
      Student.findByPk(studentId),
      Subject.findByPk(subjectId),
    ]);

    if (!student || !subject) {
      return res.status(404).json({
        error: !student ? "Student not found" : "Subject not found",
      });
    }

    const mark = await Mark.create({
      studentId,
      subjectId,
      marksObtained,
      maxMarks,
      examDate: examDateObj,
      semester,
    });

    // Fetch created mark with associations
    const createdMark = await Mark.findByPk(mark.id, {
      include: [
        {
          model: Student,
          attributes: ["rollNo", "firstName", "lastName"],
        },
        {
          model: Subject,
          attributes: ["subjectCode", "subjectName"],
        },
      ],
    });

    res.status(201).json({
      message: "Mark created successfully",
      data: createdMark,
    });
  } catch (error) {
    console.error("Error creating mark:", error);
    res.status(500).json({
      error: "Failed to create mark",
      details: error.message,
    });
  }
};

module.exports = createMark;
