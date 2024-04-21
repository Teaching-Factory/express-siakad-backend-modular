"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("data_lengkap_mahasiswa_prodis", {
      id_data_lengkap_mahasiswa_prodi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      nama_status_mahasiswa: {
        type: Sequelize.STRING(40),
        allowNull: true,
      },
      jalur_masuk: {
        type: Sequelize.DECIMAL(4, 0),
        allowNull: true,
      },
      nama_jalur_masuk: {
        type: Sequelize.STRING(60),
        allowNull: true,
      },
      sks_diakui: {
        type: Sequelize.DECIMAL(3, 0),
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
      id_periode_masuk: {
        type: Sequelize.CHAR(5),
        allowNull: true,
        references: {
          model: {
            tableName: "semesters",
          },
          key: "id_semester",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_registrasi_mahasiswa: {
        type: Sequelize.STRING(32),
        allowNull: true,
        references: {
          model: {
            tableName: "mahasiswas",
          },
          key: "id_registrasi_mahasiswa",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_agama: {
        type: Sequelize.SMALLINT(5),
        allowNull: true,
        references: {
          model: {
            tableName: "agamas",
          },
          key: "id_agama",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_wilayah: {
        type: Sequelize.CHAR(8),
        allowNull: true,
        references: {
          model: {
            tableName: "wilayahs",
          },
          key: "id_wilayah",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_jenis_tinggal: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: true,
        references: {
          model: {
            tableName: "jenis_tinggals",
          },
          key: "id_jenis_tinggal",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_alat_transportasi: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: true,
        references: {
          model: {
            tableName: "alat_transportasis",
          },
          key: "id_alat_transportasi",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_pendidikan_ayah: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: true,
        references: {
          model: {
            tableName: "jenjang_pendidikans",
          },
          key: "id_jenjang_didik",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_pekerjaan_ayah: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "pekerjaans",
          },
          key: "id_pekerjaan",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_penghasilan_ayah: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "penghasilans",
          },
          key: "id_penghasilan",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_pendidikan_ibu: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: true,
        references: {
          model: {
            tableName: "jenjang_pendidikans",
          },
          key: "id_jenjang_didik",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_pekerjaan_ibu: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "pekerjaans",
          },
          key: "id_pekerjaan",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_penghasilan_ibu: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "penghasilans",
          },
          key: "id_penghasilan",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_pendidikan_wali: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: true,
        references: {
          model: {
            tableName: "jenjang_pendidikans",
          },
          key: "id_jenjang_didik",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_pekerjaan_wali: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "pekerjaans",
          },
          key: "id_pekerjaan",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_penghasilan_wali: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "penghasilans",
          },
          key: "id_penghasilan",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_kebutuhan_khusus_mahasiswa: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "kebutuhan_khusus",
          },
          key: "id_kebutuhan_khusus",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_kebutuhan_khusus_ayah: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "kebutuhan_khusus",
          },
          key: "id_kebutuhan_khusus",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_kebutuhan_khusus_ibu: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "kebutuhan_khusus",
          },
          key: "id_kebutuhan_khusus",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_perguruan_tinggi_asal: {
        type: Sequelize.STRING(32),
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
      id_prodi_asal: {
        type: Sequelize.STRING(32),
        allowNull: true,
        references: {
          model: {
            tableName: "prodis",
          },
          key: "id_prodi",
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
    await queryInterface.dropTable("data_lengkap_mahasiswa_prodis");
  },
};
