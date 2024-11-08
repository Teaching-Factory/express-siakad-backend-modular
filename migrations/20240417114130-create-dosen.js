"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("dosens", {
      id_dosen: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      nama_dosen: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      nidn: {
        type: Sequelize.CHAR(10),
        allowNull: false,
      },
      nip: {
        type: Sequelize.STRING(18),
        allowNull: true,
      },
      jenis_kelamin: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      tanggal_lahir: {
        type: Sequelize.DATEONLY,
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
      id_agama: {
        type: Sequelize.SMALLINT(5),
        allowNull: false,
        references: {
          model: {
            tableName: "agamas",
          },
          key: "id_agama",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_status_aktif: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
        references: {
          model: {
            tableName: "status_keaktifan_pegawais",
          },
          key: "id_status_aktif",
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
    await queryInterface.dropTable("dosens");
  },
};
