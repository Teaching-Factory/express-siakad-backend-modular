"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rekap_jumlah_mahasiswas", {
      id_rekap_jumlah_mahasiswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      nama_periode: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      aktif: {
        type: Sequelize.DECIMAL(3, 0),
        allowNull: true,
      },
      cuti: {
        type: Sequelize.DECIMAL(3, 0),
        allowNull: true,
      },
      non_aktif: {
        type: Sequelize.DECIMAL(3, 0),
        allowNull: true,
      },
      sedang_double_degree: {
        type: Sequelize.DECIMAL(3, 0),
        allowNull: true,
      },
      id_periode: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "periodes",
          },
          key: "id_periode",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_prodi: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: {
            tableName: "prodis",
          },
          key: "id_prodi",
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
    await queryInterface.dropTable("rekap_jumlah_mahasiswas");
  },
};
