"use strict";
const { User, UserRole, AdminProdi, Prodi, Role } = require("../models");
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // get all data prodi
    const all_prodi = await Prodi.findAll();

    // get data role admin prodi
    const role_admin_prodi = await Role.findOne({
      where: {
        nama_role: "admin-prodi",
      },
    });

    // Hash password sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash("12345678", 10);

    // create data user admin prodi loop
    for (let prodi of all_prodi) {
      const user = await User.create({
        nama: "Admin " + prodi.nama_program_studi,
        username: "admin_" + prodi.kode_program_studi,
        email: null,
        hints: "12345678",
        password: hashedPassword,
        status: true,
      });

      await UserRole.create({
        id_user: user.id,
        id_role: role_admin_prodi.id,
      });

      await AdminProdi.create({
        id_user: user.id,
        id_prodi: prodi.id_prodi,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("admin_prodis", null, {});
  },
};
