const axios = require("axios");
const { SettingWSFeeder } = require("../../../models");

const getToken = async () => {
  try {
    // Pengambilan data web service feeder yang aktif
    const ws_feeder = await SettingWSFeeder.findOne({
      where: {
        status: true
      }
    });

    // Jika data tidak ditemukan, kirim respons 404
    if (!ws_feeder) {
      return {
        status: 404,
        message: `<===== Web Service Feeder Not Found:`
      };
    }

    const requestBody = {
      act: "GetToken",
      username: `${ws_feeder.username_feeder}`,
      password: `${ws_feeder.password_feeder}`
    };

    // Kirim permintaan POST ke URL untuk mendapatkan token
    const response = await axios.post(`${ws_feeder.url_feeder}`, requestBody);

    // Ambil token dari respons
    const token = response.data.data.token;

    // Kembalikan token dan url_feeder
    return {
      token,
      url_feeder: ws_feeder.url_feeder
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getToken
};
