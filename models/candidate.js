"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Candidate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Candidate.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      candidateNo: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      name: DataTypes.STRING,
      vision: DataTypes.STRING,
      mission: {
        type: DataTypes.STRING,
        get() {
          const value = this.getDataValue("mission");
          return value ? JSON.parse(value) : [];
        },
        set(value) {
          this.setDataValue("mission", JSON.stringify(value));
        },
      },
      img: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Candidate",
    }
  );
  return Candidate;
};
