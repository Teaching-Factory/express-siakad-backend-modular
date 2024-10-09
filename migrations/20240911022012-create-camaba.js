"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("camabas", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4
      },
      nomor_daftar: {
        type: Sequelize.STRING(13), // nomor pendaftar yang unik, juga untuk username pengguna (user) camaba
        allowNull: false
      },
      hints: {
        type: Sequelize.STRING(8), // untuk password pengguna (user) camaba
        allowNull: false
      },
      tanggal_pendaftaran: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      nama_lengkap: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      nim: {
        type: Sequelize.STRING(24),
        allowNull: true
      },
      foto_profil: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      tempat_lahir: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      tanggal_lahir: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      jenis_kelamin: {
        type: Sequelize.ENUM("Laki-laki", "Perempuan"),
        allowNull: false
      },
      nomor_hp: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      status_pembayaran: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      status_berkas: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      status_tes: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      status_akun_pendaftar: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      status_export_mahasiswa: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      finalisasi: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      id_prodi_diterima: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: {
            tableName: "prodis"
          },
          key: "id_prodi"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_periode_pendaftaran: {
        type: Sequelize.STRING(36),
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
      id_pembiayaan: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "pembiayaans"
          },
          key: "id_pembiayaan"
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
    await queryInterface.dropTable("camabas");
  }
};
