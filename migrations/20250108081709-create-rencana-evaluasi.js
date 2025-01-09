"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rencana_evaluasis", {
      id_rencana_evaluasi: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      nama_evaluasi: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      deskripsi_indonesia: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      deskripsi_inggris: {
        type: Sequelize.STRING(1000),
        allowNull: true,
      },
      nomor_urut: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      bobot_evaluasi: {
        type: Sequelize.DECIMAL(6, 4),
        allowNull: true,
      },
      last_sync: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      id_feeder: {
        type: Sequelize.STRING(36),
        allowNull: true,
      },
      id_jenis_evaluasi: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        references: {
          model: {
            tableName: "jenis_evaluasis",
          },
          key: "id_jenis_evaluasi",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_matkul: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "mata_kuliahs",
          },
          key: "id_matkul",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("rencana_evaluasis");
  },
};
