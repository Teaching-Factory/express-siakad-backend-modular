"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("substansis", {
      id_substansi: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      nama_substansi: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      sks_mata_kuliah: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      sks_tatap_muka: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      sks_praktek: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      sks_praktek_lapangan: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      sks_simulasi: {
        type: Sequelize.DECIMAL(5, 2),
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
      id_prodi: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "prodis",
          },
          key: "id_prodi",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_jenis_substansi: {
        type: Sequelize.CHAR(5),
        allowNull: false,
        references: {
          model: {
            tableName: "jenis_substansis",
          },
          key: "id_jenis_substansi",
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
    await queryInterface.dropTable("substansis");
  },
};
