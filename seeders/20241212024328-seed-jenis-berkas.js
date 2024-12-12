"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("jenis_berkas", [
      {
        id: 1,
        nama_berkas: "KTP",
        keterangan_singkat: null,
        jumlah: 1,
        wajib: false,
        upload: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        nama_berkas: "Kartu Keluarga",
        keterangan_singkat: null,
        jumlah: 1,
        wajib: false,
        upload: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        nama_berkas: "Transkrip Nilai",
        keterangan_singkat: null,
        jumlah: 1,
        wajib: false,
        upload: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        nama_berkas: "Ijazah / SKL",
        keterangan_singkat: null,
        jumlah: 1,
        wajib: false,
        upload: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        nama_berkas: "Pas Foto",
        keterangan_singkat: "Foto formal, ukuran 4x6 Background Merah",
        jumlah: 1,
        wajib: false,
        upload: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        nama_berkas: "Bukti Pembayaran Registrasi",
        keterangan_singkat: "BRI No.rek 171901002984533 a.n PANITIA PSMB UBI (Non-kes 250k, Kes 300k, Pasca 350k)",
        jumlah: 1,
        wajib: false,
        upload: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("jenis_berkas", null, {});
  },
};
