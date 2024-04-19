"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kelas_kuliahs", {
      id_kelas_kuliah: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(32),
        defaultValue: Sequelize.UUIDV4,
      },
      nama_kelas_kuliah: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      sks: {
        type: Sequelize.DECIMAL(5, 0),
        allowNull: true,
      },
      jumlah_mahasiswa: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
      },
      apa_untuk_pditt: {
        type: Sequelize.DECIMAL(1, 0),
        allowNull: true,
      },
      lingkup: {
        type: Sequelize.DECIMAL(1, 0),
        allowNull: true,
      },
      mode: {
        type: Sequelize.CHAR(1),
        allowNull: true,
      },
      id_prodi: {
        type: Sequelize.STRING(32),
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
      id_matkul: {
        type: Sequelize.STRING(32),
        allowNull: false,
        references: {
          model: {
            tableName: "list_mata_kuliahs",
          },
          key: "id_matkul",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_dosen: {
        type: Sequelize.STRING(32),
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
    await queryInterface.dropTable("kelas_kuliahs");
  },
};
