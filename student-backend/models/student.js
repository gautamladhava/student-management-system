const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rollNo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "Students",
    timestamps: true,
  }
);

module.exports = Student;
