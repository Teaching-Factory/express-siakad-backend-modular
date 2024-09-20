"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tagihan_camabas", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4
      },
      jumlah_tagihan: {
        type: Sequelize.DECIMAL(12, 0),
        allowNull: true,
        defaultValue: 0
      },
      tanggal_tagihan: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      tanggal_lunas: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      status_tagihan: {
        type: Sequelize.ENUM("Lunas", "Belum Bayar"),
        allowNull: true,
        defaultValue: "Belum Bayar"
      },
      upload_bukti: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      validasi_tagihan: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      id_jenis_tagihan: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: {
            tableName: "jenis_tagihans"
          },
          key: "id_jenis_tagihan"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_semester: {
        type: Sequelize.CHAR(5),
        allowNull: false,
        references: {
          model: {
            tableName: "semesters"
          },
          key: "id_semester"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_camaba: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "camabas"
          },
          key: "id"
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
    await queryInterface.dropTable("tagihan_camabas");
  }
};
