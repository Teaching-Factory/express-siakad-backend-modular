"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mahasiswa_lulus_dos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      tanggal_keluar: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      keterangan: {
        type: Sequelize.STRING(128),
        allowNull: true,
      },
      nomor_sk_yudisium: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      tanggal_sk_yudisium: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      ipk: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      nomor_ijazah: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      jalur_skripsi: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
      },
      judul_skripsi: {
        type: Sequelize.STRING(128),
        allowNull: true,
      },
      bulan_awal_bimbingan: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      bulan_akhir_bimbingan: {
        type: Sequelize.DATEONLY,
        allowNull: true,
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
      id_jenis_keluar: {
        type: Sequelize.CHAR(1),
        allowNull: false,
        references: {
          model: {
            tableName: "jenis_keluars",
          },
          key: "id_jenis_keluar",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_periode_keluar: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "periode_perkuliahans",
          },
          key: "id_periode_perkuliahan",
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
    await queryInterface.dropTable("mahasiswa_lulus_dos");
  },
};
