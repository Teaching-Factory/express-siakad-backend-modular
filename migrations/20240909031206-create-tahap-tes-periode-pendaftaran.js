"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tahap_tes_periode_pendaftarans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      urutan_tes: {
        type: Sequelize.ENUM(["1", "2", "3", "4", "5"]),
        allowNull: false
      },
      tanggal_awal_tes: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      tanggal_akhir_tes: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      id_jenis_tes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "jenis_tes"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_periode_pendaftaran: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: {
            tableName: "periode_pendaftarans"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tahap_tes_periode_pendaftarans");
  }
};
