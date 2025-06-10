const { getAllProdi } = require("../../src/modules/prodi/controller");
const { Prodi } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getAllProdi", () => {
  // mendefinisikan parameter fungsi
  let req, res, next;

  // membuat fungsi yang dipalsukan
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kasus uji 1 - ketika data prodi berhasil diambil
  it("should return all prodi with status 200", async () => {
    // mendefinisikan data palsu untuk prodi
    const mockProdiData = [
      { id_prodi: 1, nama_program_studi: "Prodi 1" },
      { id_prodi: 2, nama_program_studi: "Prodi 2" },
    ];

    // mengimplementasikan jest untuk menjalankan fungsi palsu
    jest.spyOn(Prodi, "findAll").mockResolvedValue(mockProdiData);
    await getAllProdi(req, res, next);

    // ekspektasi output dan perbandingan dengan output yang diperoleh
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Prodi Success",
      jumlahData: mockProdiData.length,
      data: mockProdiData,
    });
  });

  // Kasus uji 2 - ketika data prodi kosong atau tidak ditemukan
  it("should return 404 when no prodi found", async () => {
    // Stub Prodi.findAll untuk mengembalikan Promise yang diresolves dengan array kosong
    jest.spyOn(Prodi, "findAll").mockResolvedValue([]);

    // Menjalankan fungsi yang akan diuji
    await getAllProdi(req, res, next);

    // Memeriksa respons dari fungsi
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Prodi Not Found:",
    });
  });

  // Kasus Uji 3 - menangani eror ketika fungsi ingin mengambil dan mengakses data dari database
  it("should handle errors", async () => {
    const errorMessage = "Database error";
    Prodi.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllProdi(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
