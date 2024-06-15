const httpMocks = require("node-mocks-http");
const { getAllMahasiswaBelumSetSK } = require("../../src/controllers/sistem-kuliah");
const { Mahasiswa, SistemKuliahMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getAllMahasiswaBelumSetSK", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get all mahasiswa belum set SK and return 200", async () => {
    const mockSistemKuliahMahasiswa = [{ id_registrasi_mahasiswa: 1 }, { id_registrasi_mahasiswa: 2 }];
    const mockMahasiswa = [
      { id: 1, nama: "Mahasiswa 1" },
      { id: 2, nama: "Mahasiswa 2" },
    ];

    SistemKuliahMahasiswa.findAll.mockResolvedValue(mockSistemKuliahMahasiswa);
    Mahasiswa.findAll.mockResolvedValue(mockMahasiswa);

    await getAllMahasiswaBelumSetSK(req, res, next);

    expect(SistemKuliahMahasiswa.findAll).toHaveBeenCalled();
    expect(Mahasiswa.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "GET All Mahasiswa Belum Set Sistem Kuliah Success",
      jumlahData: mockMahasiswa.length,
      data: mockMahasiswa,
    });
  });

  it("should handle case where no mahasiswa belum set SK is found", async () => {
    SistemKuliahMahasiswa.findAll.mockResolvedValue([]);
    Mahasiswa.findAll.mockResolvedValue([]);

    await getAllMahasiswaBelumSetSK(req, res, next);

    expect(SistemKuliahMahasiswa.findAll).toHaveBeenCalled();
    expect(Mahasiswa.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Mahasiswa yang belum diatur sistem kuliah tidak ditemukan",
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    SistemKuliahMahasiswa.findAll.mockRejectedValue(error);

    await getAllMahasiswaBelumSetSK(req, res, next);

    expect(SistemKuliahMahasiswa.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
