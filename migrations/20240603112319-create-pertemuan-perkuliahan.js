"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pertemuan_perkuliahans", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      pertemuan: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
      },
      tanggal_pertemuan: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      waktu_mulai: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      waktu_selesai: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      materi: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      jumlah_mahasiswa_hadir: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        defaultValue: 0,
      },
      kunci_pertemuan: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      buka_presensi: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      id_ruang_perkuliahan: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: {
            tableName: "ruang_perkuliahans",
          },
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("pertemuan_perkuliahans");
  },
};
