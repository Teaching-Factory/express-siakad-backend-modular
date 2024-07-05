"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pembayaran_mahasiswas", {
      id_pembayaran_mahasiswa: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      upload_bukti_tf: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      status_pembayaran: {
        type: Sequelize.ENUM("Menunggu Konfirmasi", "Dikonfirmasi", "Ditolak", "Mengirim Ulang"),
        allowNull: false,
      },
      id_tagihan_mahasiswa: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "tagihan_mahasiswas",
          },
          key: "id_tagihan_mahasiswa",
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
    await queryInterface.dropTable("pembayaran_mahasiswas");
  },
};
