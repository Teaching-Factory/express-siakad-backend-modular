const { BlacklistedToken } = require("../../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

async function cleanExpiredTokens() {
  console.log("Cronjob started");

  try {
    // Hapus token yang telah kadaluarsa
    await BlacklistedToken.destroy({
      where: {
        expiresAt: {
          [Op.lte]: new Date(), // Token yang kedaluwarsa sekarang atau sebelumnya
        },
      },
    });
    console.log("Expired tokens cleaned up");
  } catch (error) {
    console.error("Error cleaning expired tokens:", error);
  }

  console.log("Cronjob finished");
}

module.exports = cleanExpiredTokens;
