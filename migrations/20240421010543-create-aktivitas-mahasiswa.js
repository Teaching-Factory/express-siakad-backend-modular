"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("aktivitas_mahasiswas", {
      id_aktivitas: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      jenis_anggota: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
      },
      nama_jenis_anggota: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      judul: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      keterangan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      lokasi: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      sk_tugas: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      tanggal_sk_tugas: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      untuk_kampus_merdeka: {
        type: Sequelize.DECIMAL(1, 0),
        allowNull: true,
      },
      id_jenis_aktivitas: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
        references: {
          model: {
            tableName: "jenis_aktivitas_mahasiswas",
          },
          key: "id_jenis_aktivitas_mahasiswa",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      id_semester: {
        type: Sequelize.CHAR(5),
        allowNull: false,
        references: {
          model: {
            tableName: "semesters",
          },
          key: "id_semester",
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
    await queryInterface.dropTable("aktivitas_mahasiswas");
  },
};
