"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("perkuliahan_mahasiswas", {
      id_perkuliahan_mahasiswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      angkatan: {
        type: Sequelize.CHAR(4),
        allowNull: true,
      },
      ips: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      ipk: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      sks_semester: {
        type: Sequelize.DECIMAL(3, 0),
        allowNull: true,
      },
      sks_total: {
        type: Sequelize.DECIMAL(5, 0),
        allowNull: true,
      },
      biaya_kuliah_smt: {
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
      id_status_mahasiswa: {
        type: Sequelize.CHAR(1),
        allowNull: false,
        references: {
          model: {
            tableName: "status_mahasiswas",
          },
          key: "id_status_mahasiswa",
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
    await queryInterface.dropTable("perkuliahan_mahasiswas");
  },
};
