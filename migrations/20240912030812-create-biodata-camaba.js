"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("biodata_camabas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nik: {
        type: Sequelize.CHAR(18),
        allowNull: true
      },
      nisn: {
        type: Sequelize.CHAR(10),
        allowNull: true
      },
      npwp: {
        type: Sequelize.CHAR(15),
        allowNull: true
      },
      kewarganegaraan: {
        type: Sequelize.CHAR(20),
        allowNull: true
      },
      jalan: {
        type: Sequelize.STRING(80),
        allowNull: true
      },
      dusun: {
        type: Sequelize.STRING(60),
        allowNull: true
      },
      rt: {
        type: Sequelize.DECIMAL(3, 0),
        allowNull: true
      },
      rw: {
        type: Sequelize.DECIMAL(3, 0),
        allowNull: true
      },
      kelurahan: {
        type: Sequelize.STRING(60),
        allowNull: true
      },
      kode_pos: {
        type: Sequelize.DECIMAL(5, 0),
        allowNull: true
      },
      telepon: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      handphone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(60),
        allowNull: true
      },
      nik_ayah: {
        type: Sequelize.CHAR(16),
        allowNull: true
      },
      nama_ayah: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      tanggal_lahir_ayah: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      nik_ibu: {
        type: Sequelize.CHAR(16)
      },
      nama_ibu_kandung: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      tanggal_lahir_ibu: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      nama_wali: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      tanggal_lahir_wali: {
        type: Sequelize.DATEONLY,
        allowNull: true
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
      id_sekolah: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: {
            tableName: "sekolahs"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_agama: {
        type: Sequelize.SMALLINT(5),
        allowNull: true,
        references: {
          model: {
            tableName: "agamas"
          },
          key: "id_agama"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_wilayah: {
        type: Sequelize.CHAR(8),
        allowNull: true,
        references: {
          model: {
            tableName: "wilayahs"
          },
          key: "id_wilayah"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_jenis_tinggal: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: true,
        references: {
          model: {
            tableName: "jenis_tinggals"
          },
          key: "id_jenis_tinggal"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_pendidikan_ayah: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: true,
        references: {
          model: {
            tableName: "jenjang_pendidikans"
          },
          key: "id_jenjang_didik"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_pekerjaan_ayah: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "pekerjaans"
          },
          key: "id_pekerjaan"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_penghasilan_ayah: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "penghasilans"
          },
          key: "id_penghasilan"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_pendidikan_ibu: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: true,
        references: {
          model: {
            tableName: "jenjang_pendidikans"
          },
          key: "id_jenjang_didik"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_pekerjaan_ibu: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "pekerjaans"
          },
          key: "id_pekerjaan"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_penghasilan_ibu: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "penghasilans"
          },
          key: "id_penghasilan"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_pendidikan_wali: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: true,
        references: {
          model: {
            tableName: "jenjang_pendidikans"
          },
          key: "id_jenjang_didik"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_pekerjaan_wali: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "pekerjaans"
          },
          key: "id_pekerjaan"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_penghasilan_wali: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "penghasilans"
          },
          key: "id_penghasilan"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("biodata_camabas");
  }
};
