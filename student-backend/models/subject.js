// filepath: f:\student-management-system\student-backend\models\subject.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Subject = sequelize.define(
  "Subject",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subjectCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    subjectName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Subjects",
    timestamps: true,
  }
);

module.exports = Subject;
