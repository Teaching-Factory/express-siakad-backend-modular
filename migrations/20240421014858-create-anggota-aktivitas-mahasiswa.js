"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("anggota_aktivitas_mahasiswas", {
      id_anggota: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(32),
        defaultValue: Sequelize.UUIDV4,
      },
      jenis_peran: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      nama_jenis_peran: {
        type: Sequelize.CHAR(10),
        allowNull: false,
      },
      id_aktivitas: {
        type: Sequelize.STRING(32),
        allowNull: false,
        references: {
          model: {
            tableName: "aktivitas_mahasiswas",
          },
          key: "id_aktivitas",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_registrasi_mahasiswa: {
        type: Sequelize.STRING(32),
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
    await queryInterface.dropTable("anggota_aktivitas_mahasiswas");
  },
};
