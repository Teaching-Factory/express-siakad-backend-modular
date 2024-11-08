"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kurikulums", {
      id_kurikulum: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      nama_kurikulum: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      semester_mulai_berlaku: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      jumlah_sks_lulus: {
        type: Sequelize.DECIMAL(3, 0),
        allowNull: false,
      },
      jumlah_sks_wajib: {
        type: Sequelize.DECIMAL(3, 0),
        allowNull: false,
      },
      jumlah_sks_pilihan: {
        type: Sequelize.DECIMAL(3, 0),
        allowNull: false,
      },
      jumlah_sks_mata_kuliah_wajib: {
        type: Sequelize.DECIMAL(3, 0),
        allowNull: true,
      },
      jumlah_sks_mata_kuliah_pilihan: {
        type: Sequelize.DECIMAL(3, 0),
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
    await queryInterface.dropTable("kurikulums");
  },
};
