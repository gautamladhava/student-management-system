const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Mark = sequelize.define(
  "Mark",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Students",
        key: "id",
      },
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Subjects",
        key: "id",
      },
    },
    marksObtained: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    maxMarks: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    examDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Marks",
    timestamps: true,
  }
);

module.exports = Mark;
