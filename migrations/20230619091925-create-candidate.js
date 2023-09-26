"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Candidates", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      candidateNo: {
        type: Sequelize.INTEGER,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      vision: {
        type: Sequelize.STRING,
      },
      mission: {
        type: Sequelize.STRING,
      },
      img: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // // Create a trigger to auto-increment candidateId
    // await queryInterface.sequelize.query(`
    //     CREATE TRIGGER auto_increment_candidateNo BEFORE INSERT ON Candidates
    //     FOR EACH ROW
    //     BEGIN
    //       IF NEW.candidateNo IS NULL THEN
    //         SET NEW.candidateNo = (SELECT COALESCE(MAX(candidateNo), 0) + 1 FROM Candidates);
    //       END IF;
    //     END;
    //   `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Candidates");
  },
};
