"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("periode_pendaftarans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10)
      },
      nama_periode_pendaftaran: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      tanggal_awal_pendaftaran: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      tanggal_akhir_pendaftaran: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      dibuka: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      berbayar: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      biaya_pendaftaran: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
        defaultValue: 0
      },
      batas_akhir_pembayaran: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      jumlah_pilihan_prodi: {
        type: Sequelize.ENUM(["1", "2 ", "3"]),
        allowNull: false
      },
      deskripsi_singkat: {
        type: Sequelize.STRING(80),
        allowNull: true
      },
      konten_informasi: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      sumber_informasi: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      id_semester: {
        type: Sequelize.CHAR(5),
        allowNull: false,
        references: {
          model: {
            tableName: "semesters"
          },
          key: "id_semester"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_jalur_masuk: {
        type: Sequelize.DECIMAL(4, 0),
        allowNull: false,
        references: {
          model: {
            tableName: "jalur_masuks"
          },
          key: "id_jalur_masuk"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_sistem_kuliah: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: {
            tableName: "sistem_kuliahs"
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
    await queryInterface.dropTable("periode_pendaftarans");
  }
};
