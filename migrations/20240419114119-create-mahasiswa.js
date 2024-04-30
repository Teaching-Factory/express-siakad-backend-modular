"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mahasiswas", {
      id_registrasi_mahasiswa: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      nama_mahasiswa: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      jenis_kelamin: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      tanggal_lahir: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      nipd: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
      },
      ipk: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      total_sks: {
        type: Sequelize.DECIMAL(3, 0),
        allowNull: true,
      },
      nama_status_mahasiswa: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      nim: {
        type: Sequelize.STRING(24),
        allowNull: true,
      },
      nama_periode_masuk: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      id_sms: {
        type: Sequelize.STRING(36),
        allowNull: false,
      },
      id_perguruan_tinggi: {
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
      id_agama: {
        type: Sequelize.SMALLINT(5),
        allowNull: false,
        references: {
          model: {
            tableName: "agamas",
          },
          key: "id_agama",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_periode: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "periodes",
          },
          key: "id_periode",
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
    await queryInterface.dropTable("mahasiswas");
  },
};
