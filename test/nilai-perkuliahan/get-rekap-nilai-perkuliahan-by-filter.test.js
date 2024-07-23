const httpMocks = require("node-mocks-http");
const { getRekapNilaiPerkuliahanByFilter } = require("../../src/controllers/nilai-perkuliahan");
const { KelasKuliah, DetailNilaiPerkuliahanKelas, NilaiPerkuliahan, BobotPenilaian, UnsurPenilaian, Mahasiswa } = require("../../models");

jest.mock("../../models");

describe("getRekapNilaiPerkuliahanByFilter", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      query: {
        id_semester: 1,
        id_prodi: 1,
        nama_kelas_kuliah: "Test Class",
        format: "pdf",
        tanggal_penandatanganan: "2024-01-01",
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if id_semester is missing", async () => {
    req.query.id_semester = undefined;
    await getRekapNilaiPerkuliahanByFilter(req, res, next);
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "id_semester is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if id_prodi is missing", async () => {
    req.query.id_prodi = undefined;
    await getRekapNilaiPerkuliahanByFilter(req, res, next);
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "id_prodi is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if nama_kelas_kuliah is missing", async () => {
    req.query.nama_kelas_kuliah = undefined;
    await getRekapNilaiPerkuliahanByFilter(req, res, next);
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_kelas_kuliah is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if format is missing", async () => {
    req.query.format = undefined;
    await getRekapNilaiPerkuliahanByFilter(req, res, next);
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "format is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if tanggal_penandatanganan is missing", async () => {
    req.query.tanggal_penandatanganan = undefined;
    await getRekapNilaiPerkuliahanByFilter(req, res, next);
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "tanggal_penandatanganan is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if kelas_kuliah is not found", async () => {
    KelasKuliah.findOne.mockResolvedValue(null);
    await getRekapNilaiPerkuliahanByFilter(req, res, next);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Kelas Kuliah Not Found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error" };
    const rejectedPromise = Promise.reject(errorMessage);
    KelasKuliah.findOne.mockReturnValue(rejectedPromise);
    await getRekapNilaiPerkuliahanByFilter(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
