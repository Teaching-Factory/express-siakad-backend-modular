"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("biodata_dosens", {
      id_detail_biodata_dosen: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      tempat_lahir: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      nama_ibu_kandung: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      nik: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      npwp: {
        type: Sequelize.CHAR(18),
        allowNull: true,
      },
      id_jenis_sdm: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
      },
      nama_jenis_sdm: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      no_sk_cpns: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      tanggal_sk_cpns: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      no_sk_pengangkatan: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      mulai_sk_pengangkatan: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      id_sumber_gaji: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
      },
      nama_sumber_gaji: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      jalan: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      dusun: {
        type: Sequelize.STRING(60),
        allowNull: true,
      },
      rt: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: true,
      },
      rw: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: true,
      },
      ds_kel: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      kode_pos: {
        type: Sequelize.DECIMAL(5, 0),
        allowNull: true,
      },
      telepon: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      handphone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(60),
        allowNull: true,
      },
      status_pernikahan: {
        type: Sequelize.DECIMAL(1, 0),
        allowNull: false,
      },
      nama_suami_istri: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      nip_suami_istri: {
        type: Sequelize.STRING(18),
        allowNull: true,
      },
      tanggal_mulai_pns: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      id_dosen: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "dosens",
          },
          key: "id_dosen",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_lembaga_pengangkatan: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
        references: {
          model: {
            tableName: "lembaga_pengangkatans",
          },
          key: "id_lembaga_angkat",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_pangkat_golongan: {
        type: Sequelize.INTEGER(2),
        allowNull: true,
        references: {
          model: {
            tableName: "pangkat_golongans",
          },
          key: "id_pangkat_golongan",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_wilayah: {
        type: Sequelize.CHAR(8),
        allowNull: false,
        references: {
          model: {
            tableName: "wilayahs",
          },
          key: "id_wilayah",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_pekerjaan_suami_istri: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: {
            tableName: "pekerjaans",
          },
          key: "id_pekerjaan",
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
    await queryInterface.dropTable("biodata_dosens");
  },
};
