const httpMocks = require("node-mocks-http");
const { getAllTagihanMahasiswaByMahasiswaActive } = require("../../src/modules/tagihan-mahasiswa/controller");
const { Mahasiswa, TagihanMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getAllTagihanMahasiswaByMahasiswaActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 404 if mahasiswa not found", async () => {
    req.user = { username: "123456" };

    Mahasiswa.findOne.mockResolvedValue(null);

    await getAllTagihanMahasiswaByMahasiswaActive(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: "Mahasiswa not found" });
  });

  it("should return all tagihan mahasiswa by mahasiswa active with status 200", async () => {
    req.user = { username: "123456" };

    const mockMahasiswa = { id_registrasi_mahasiswa: 1, nim: "123456" };
    const mockTagihanMahasiswa = [
      {
        id: 1,
        id_registrasi_mahasiswa: 1,
        Periode: { id: 1, nama: "2023/2024" },
        Mahasiswa: mockMahasiswa,
        JenisTagihan: { id: 1, nama_tagihan: "SPP" },
      },
    ];

    Mahasiswa.findOne.mockResolvedValue(mockMahasiswa);
    TagihanMahasiswa.findAll.mockResolvedValue(mockTagihanMahasiswa);

    await getAllTagihanMahasiswaByMahasiswaActive(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Tagihan Mahasiswa By Mahasiswa Active Success",
      jumlahData: mockTagihanMahasiswa.length,
      data: mockTagihanMahasiswa,
    });
  });
});
