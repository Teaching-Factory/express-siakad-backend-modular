const httpMocks = require("node-mocks-http");
const { getSistemKuliahMahasiswaByProdiAndSistemKuliahId } = require("../../src/modules/sistem-kuliah/controller");
const { SistemKuliahMahasiswa, Mahasiswa, Periode, Prodi, BiodataMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getSistemKuliahMahasiswaByProdiAndSistemKuliahId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get sistem kuliah mahasiswa by Prodi ID and Sistem Kuliah ID and return 200 if found", async () => {
    const prodiId = 1;
    const sistemKuliahId = 1;
    const mockSistemKuliahMahasiswa = [
      { id: 1, nama: "Mahasiswa A" },
      { id: 2, nama: "Mahasiswa B" },
    ];

    req.params.id_prodi = prodiId;
    req.params.id_sistem_kuliah = sistemKuliahId;

    SistemKuliahMahasiswa.findAll.mockResolvedValue(mockSistemKuliahMahasiswa);

    await getSistemKuliahMahasiswaByProdiAndSistemKuliahId(req, res, next);

    expect(SistemKuliahMahasiswa.findAll).toHaveBeenCalledWith({
      include: {
        model: Mahasiswa,
        required: true,
        where: {
          id_prodi: prodiId,
        },
        include: [{ model: Prodi }, { model: BiodataMahasiswa }],
      },
      where: {
        id_sistem_kuliah: sistemKuliahId,
      },
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET All Sistem Kuliah Mahasiswa By Prodi ID ${prodiId} And Sistem Kuliah ID ${sistemKuliahId} Success`,
      jumlahData: mockSistemKuliahMahasiswa.length,
      data: mockSistemKuliahMahasiswa,
    });
  });

  it("should return 400 if prodi ID is not provided", async () => {
    req.params.id_prodi = undefined;
    req.params.id_sistem_kuliah = 1;

    await getSistemKuliahMahasiswaByProdiAndSistemKuliahId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
    expect(SistemKuliahMahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should return 400 if sistem kuliah ID is not provided", async () => {
    req.params.id_prodi = 1;
    req.params.id_sistem_kuliah = undefined;

    await getSistemKuliahMahasiswaByProdiAndSistemKuliahId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Sistem Kuliah ID is required",
    });
    expect(SistemKuliahMahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const prodiId = 1;
    const sistemKuliahId = 1;

    req.params.id_prodi = prodiId;
    req.params.id_sistem_kuliah = sistemKuliahId;

    SistemKuliahMahasiswa.findAll.mockRejectedValue(error);

    await getSistemKuliahMahasiswaByProdiAndSistemKuliahId(req, res, next);

    expect(SistemKuliahMahasiswa.findAll).toHaveBeenCalledWith({
      include: {
        model: Mahasiswa,
        required: true,
        where: {
          id_prodi: prodiId,
        },
        include: [{ model: Prodi }, { model: BiodataMahasiswa }],
      },
      where: {
        id_sistem_kuliah: sistemKuliahId,
      },
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
