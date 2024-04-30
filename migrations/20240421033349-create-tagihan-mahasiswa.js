"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tagihan_mahasiswas", {
      id_tagihan_mahasiswa: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      jumlah_tagihan: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
      },
      jenis_tagihan: {
        type: Sequelize.ENUM("SPP", "KRS", "Yudisium", "Wisuda"),
        allowNull: false,
      },
      tanggal_tagihan: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      deadline_tagihan: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      status_tagihan: {
        type: Sequelize.ENUM("Lunas", "Belum Bayar", "Belum Lunas"),
        allowNull: false,
      },
      id_periode: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: {
            tableName: "periodes",
          },
          key: "id_periode",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_registrasi_mahasiswa: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "mahasiswas",
          },
          key: "id_registrasi_mahasiswa",
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
    await queryInterface.dropTable("tagihan_mahasiswas");
  },
};
