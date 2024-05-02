"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("riwayat_pendidikan_mahasiswas", {
      id_riwayat_pend_mhs: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      tanggal_daftar: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      keterangan_keluar: {
        type: Sequelize.STRING(40),
        allowNull: true,
      },
      sks_diakui: {
        type: Sequelize.DECIMAL(3, 0),
        allowNull: true,
      },
      nama_ibu_kandung: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      biaya_masuk: {
        type: Sequelize.INTEGER(10),
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
      id_jenis_daftar: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: false,
        references: {
          model: {
            tableName: "jenis_pendaftarans",
          },
          key: "id_jenis_daftar",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_jalur_daftar: {
        type: Sequelize.DECIMAL(4, 0),
        allowNull: true,
        references: {
          model: {
            tableName: "jalur_masuks",
          },
          key: "id_jalur_masuk",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_periode_masuk: {
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
      id_jenis_keluar: {
        type: Sequelize.CHAR(1),
        allowNull: true,
        references: {
          model: {
            tableName: "jenis_keluars",
          },
          key: "id_jenis_keluar",
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
      id_pembiayaan: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "pembiayaans",
          },
          key: "id_pembiayaan",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_bidang_minat: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: {
            tableName: "bidang_minats",
          },
          key: "id_bidang_minat",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_perguruan_tinggi_asal: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: {
            tableName: "perguruan_tinggis",
          },
          key: "id_perguruan_tinggi",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_prodi_asal: {
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
    await queryInterface.dropTable("riwayat_pendidikan_mahasiswas");
  },
};
