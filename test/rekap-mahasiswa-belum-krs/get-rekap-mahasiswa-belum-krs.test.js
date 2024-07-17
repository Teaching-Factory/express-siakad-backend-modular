const httpMocks = require("node-mocks-http");
const { getRekapMahasiswaBelumKRS } = require("../../src/controllers/rekap-mahasiswa-belum-krs");
const { Mahasiswa, KRSMahasiswa, Angkatan, SemesterAktif, DosenWali, Prodi } = require("../../models");
const { Op } = require("sequelize");

jest.mock("../../models");

describe("getRekapMahasiswaBelumKRS", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if id_angkatan is not provided", async () => {
    req.query = { id_prodi: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };

    await getRekapMahasiswaBelumKRS(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "id_angkatan is required" });
  });

  it("should return 400 if id_prodi is not provided", async () => {
    req.query = { id_angkatan: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };

    await getRekapMahasiswaBelumKRS(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "id_prodi is required" });
  });

  it("should return 400 if format is not provided", async () => {
    req.query = { id_angkatan: 1, id_prodi: 1, tanggal_penandatanganan: "2024-01-01" };

    await getRekapMahasiswaBelumKRS(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "format is required" });
  });

  it("should return 400 if tanggal_penandatanganan is not provided", async () => {
    req.query = { id_angkatan: 1, id_prodi: 1, format: "pdf" };

    await getRekapMahasiswaBelumKRS(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "tanggal_penandatanganan is required" });
  });

  it("should return 404 if Angkatan not found", async () => {
    req.query = { id_angkatan: 1, id_prodi: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };
    Angkatan.findOne.mockResolvedValue(null);

    await getRekapMahasiswaBelumKRS(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: `Angkatan With ID 1 Not Found` });
  });

  it("should call next with error when an exception occurs", async () => {
    const mockError = new Error("Test error");
    Angkatan.findOne.mockRejectedValue(mockError);

    req.query = { id_angkatan: 1, id_prodi: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };

    await getRekapMahasiswaBelumKRS(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
