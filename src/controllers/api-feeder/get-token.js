const axios = require("axios");

const getToken = async () => {
  try {
    const requestBody = {
      act: "GetToken",
      username: "071078",
      password: "Ubibwi2023",
    };

    // Kirim permintaan POST ke URL untuk mendapatkan token
    const response = await axios.post("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", requestBody);

    // Tanggapi dari API termasuk token
    const token = response.data.data.token;

    return token;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getToken,
};
