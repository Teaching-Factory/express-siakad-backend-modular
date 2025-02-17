"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("role_permissions", [
      // role admin
      {
        id_role: 1,
        id_permission: 1, // dashboard
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 95, // dashboard-admin
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 2, // import-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 3, // daftar-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 4, // daftar-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 5, // set-sistem-kuliah-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 6, // validasi-krs-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 7, // import-aktivitas-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 11,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 13,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 14,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 16,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 17,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 18,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 19,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 21,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 22,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 23,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 24,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 26,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 27,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 28,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 29,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 31,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 32,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 33,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 34,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 35,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 36,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 37,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 38,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 39,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 41,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 42,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 43,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 44,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 46,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 47,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 48,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 49,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 51,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 52,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 53,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 54,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 55,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 56,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 57,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 58,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 59,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 61,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 62,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 83, // dashboard-info
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 96,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 97,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 98,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 101,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 102,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 103,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 104,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 105,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 1,
        id_permission: 106,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // role mahasiswa
      {
        id_role: 3,
        id_permission: 1, // dashboard
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 63, // profile-krs-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 64, // profile-krs-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 65, // profile-akm-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 66, // profile-khs-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 67, // perkuliahan-krs-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 68, // perkuliahan-khs-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 69, // jadwal-perkuliahan-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 70, // laporan-krs-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 71, // laporan-khs-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 72, // laporan-transkrip-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 73, // profile-tagihan-pembayaran-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 94, // jadwal-perkuliahan-aktif
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 75, // presensi-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 74, // dashboard-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 76, // kuesioner-penilaian-dosen-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 3,
        id_permission: 83, // dashboard-info
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // role dosen
      {
        id_role: 2,
        id_permission: 1, // dashboard
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 2,
        id_permission: 3, // daftar-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 2,
        id_permission: 6, // validasi-krs-mahasiswa
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 2,
        id_permission: 77, // jadwal-kelas-perkuliahan-dosen
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 2,
        id_permission: 14, // presensi-perkuliahan
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 2,
        id_permission: 38, // cetak-rekap-nilai-kelas
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 2,
        id_permission: 39, // cetak-rekap-presensi-kelas
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 2,
        id_permission: 78, // buka-presensi
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 2,
        id_permission: 79, // daftar-pertemuan-aktif
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 2,
        id_permission: 81, // jadwal-kelas-perkuliahan-dosen
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 2,
        id_permission: 83, // dashboard-info
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // role camaba
      {
        id_role: 7,
        id_permission: 1, // dashboard
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 7,
        id_permission: 84, // status-pendaftaran
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 7,
        id_permission: 85, // biodata-pendaftar
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 7,
        id_permission: 86, // foto-pendaftar
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 7,
        id_permission: 87, // prodi-pendaftar
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 7,
        id_permission: 88, // berkas-pendaftar
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 7,
        id_permission: 89, // pembayaran-pendaftar
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 7,
        id_permission: 90, // finalisasi-pendaftar
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 7,
        id_permission: 91, // kartu-ujian-pendaftar
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 7,
        id_permission: 92, // jadwal-seleksi-pendaftar
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 7,
        id_permission: 93, // form-pendaftaran
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 7,
        id_permission: 83, // dashboard-info
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // role admin-pmb
      {
        id_role: 6,
        id_permission: 1, // dashboard
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 6,
        id_permission: 54, // pengaturan-pmb
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 6,
        id_permission: 55, // jenis-tes
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 6,
        id_permission: 57, // periode-pendaftaran-pmb
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 6,
        id_permission: 58, // tagihan-camaba
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 6,
        id_permission: 59, // daftar-camaba
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 6,
        id_permission: 60, // set-nim-camaba
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 6,
        id_permission: 61, // export-camaba
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 6,
        id_permission: 62, // user-guide
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 6,
        id_permission: 83, // user-guide
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // role admin-prodi
      {
        id_role: 4,
        id_permission: 1, // dashboard
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 83, // dashboard-info
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 11,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 96,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 13,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 14,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 16,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 17,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 18,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 19,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 27,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 28,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 28,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 35,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 36,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 37,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 38,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 39,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 41,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 97,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 4,
        id_permission: 107,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // role admin-keuangan
      {
        id_role: 5,
        id_permission: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 5,
        id_permission: 83, // dashboard-info
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 5,
        id_permission: 32,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 5,
        id_permission: 33,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 5,
        id_permission: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 5,
        id_permission: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_role: 5,
        id_permission: 26,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("role_permissions", null, {});
  },
};
