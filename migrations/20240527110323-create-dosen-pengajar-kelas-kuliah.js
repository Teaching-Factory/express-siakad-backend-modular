"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("dosen_pengajar_kelas_kuliahs", {
      id_aktivitas_mengajar: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      sks_substansi_total: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      rencana_minggu_pertemuan: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: false,
      },
      realisasi_minggu_pertemuan: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: true,
      },
      last_sync: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      id_feeder: {
        type: Sequelize.STRING(36),
        allowNull: true,
      },
      id_registrasi_dosen: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: {
            tableName: "penugasan_dosens",
          },
          key: "id_registrasi_dosen",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_dosen: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: {
            tableName: "dosens",
          },
          key: "id_dosen",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_kelas_kuliah: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: {
            tableName: "kelas_kuliahs",
          },
          key: "id_kelas_kuliah",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_substansi: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: {
            tableName: "substansis",
          },
          key: "id_substansi",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_jenis_evaluasi: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        references: {
          model: {
            tableName: "jenis_evaluasis",
          },
          key: "id_jenis_evaluasi",
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
    await queryInterface.dropTable("dosen_pengajar_kelas_kuliahs");
  },
};
