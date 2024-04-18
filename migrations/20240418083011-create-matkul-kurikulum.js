"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("matkul_kurikulums", {
      id_matkul_kurikulum: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      semester: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: false,
      },
      apakah_wajib: {
        type: Sequelize.DECIMAL(1, 0),
        allowNull: false,
      },
      tgl_create: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      id_kurikulum: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: "kurikulums",
          },
          key: "id_kurikulum",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_matkul: {
        type: Sequelize.UUID,
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
      id_prodi: {
        type: Sequelize.UUID,
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
    await queryInterface.dropTable("matkul_kurikulums");
  },
};
