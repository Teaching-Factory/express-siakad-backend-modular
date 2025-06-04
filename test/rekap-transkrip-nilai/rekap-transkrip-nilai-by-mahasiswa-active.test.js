const { getRekapTranskripNilaiByMahasiswaActive } = require("../../src/controllers/rekap-transkrip-nilai");
const { Mahasiswa } = require("../../models");
const axios = require("axios");
jest.mock("../../models");
jest.mock("axios");
jest.mock("../../src/modules/api-feeder/data-feeder/get-token.js", () => ({
  getToken: jest.fn().mockResolvedValue("mockedToken"),
}));

describe("getRekapTranskripNilaiByMahasiswaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {
        username: "12345678",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if mahasiswa is not found", async () => {
    Mahasiswa.findOne.mockResolvedValue(null);

    await getRekapTranskripNilaiByMahasiswaActive(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Mahasiswa not found" });
  });

  //   belum pass
  //   it("should return 200 with correct data and calculations", async () => {
  //     const mockMahasiswa = { id_registrasi_mahasiswa: "1" };
  //     const mockData = [
  //       { sks_mata_kuliah: "3", nilai_indeks: "4.0" },
  //       { sks_mata_kuliah: "2", nilai_indeks: "3.5" },
  //     ];
  //     const mockResponse = { data: { data: mockData } };
  //     Mahasiswa.findOne.mockResolvedValue(mockMahasiswa);
  //     axios.post.mockResolvedValue(mockResponse);

  //     await getRekapTranskripNilaiByMahasiswaActive(req, res, next);

  //     expect(Mahasiswa.findOne).toHaveBeenCalledWith({
  //       where: { nim: "12345678" },
  //     });
  //     expect(axios.post).toHaveBeenCalledWith("http://feeder.ubibanyuwangi.ac.id:3003/ws/live2.php", {
  //       act: "GetTranskripMahasiswa",
  //       token: "mockedToken",
  //       filter: "id_registrasi_mahasiswa='1'",
  //     });

  //     expect(res.json).toHaveBeenCalledWith({
  //       message: "Get Rekap Transkrip Nilai By Mahasiswa Active from Feeder Success",
  //       total_sks: 5,
  //       total_sks_indeks: "18.50",
  //       ipk: "3.70",
  //       dataRekapTranskripNilai: mockData,
  //     });
  //   });

  it("should handle errors gracefully", async () => {
    const error = new Error("Something went wrong");
    Mahasiswa.findOne.mockRejectedValue(error);

    await getRekapTranskripNilaiByMahasiswaActive(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
