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
        defaultValue: Sequelize.literal("CURRENT_DATE"),
      },
      id_kurikulum: {
        type: Sequelize.STRING(36),
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
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "mata_kuliahs",
          },
          key: "id_matkul",
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
