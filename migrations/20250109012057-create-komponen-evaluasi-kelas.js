"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("komponen_evaluasi_kelas", {
      id_komponen_evaluasi: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      nama: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      nama_inggris: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      nomor_urut: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bobot_evaluasi: {
        type: Sequelize.DECIMAL(6, 4),
        allowNull: false,
      },
      last_sync: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      id_feeder: {
        type: Sequelize.STRING(36),
        allowNull: true,
      },
      id_kelas_kuliah: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "kelas_kuliahs",
          },
          key: "id_kelas_kuliah",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("komponen_evaluasi_kelas");
  },
};
