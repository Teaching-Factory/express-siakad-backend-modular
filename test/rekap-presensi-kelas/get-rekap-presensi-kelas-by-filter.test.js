const httpMocks = require("node-mocks-http");
const { getRekapPresensiKelasByFilter } = require("../../src/controllers/rekap-presensi-kelas");
const { KelasKuliah, PesertaKelasKuliah, PertemuanPerkuliahan, PresensiMahasiswa, MataKuliah, Dosen, Prodi, JenjangPendidikan, Mahasiswa } = require("../../models");

jest.mock("../../models");

describe("getRekapPresensiKelasByFilter", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if id_semester is missing", async () => {
    req.query = {
      id_prodi: "1",
      nama_kelas_kuliah: "Kelas A",
      format: "json",
      tanggal_penandatanganan: "2024-07-21",
    };

    await getRekapPresensiKelasByFilter(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "id_semester is required" });
  });

  it("should return 404 if kelas kuliah not found", async () => {
    req.query = {
      id_semester: "1",
      id_prodi: "1",
      nama_kelas_kuliah: "Kelas A",
      format: "json",
      tanggal_penandatanganan: "2024-07-21",
    };

    KelasKuliah.findOne.mockResolvedValue(null);

    await getRekapPresensiKelasByFilter(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: "Kelas kuliah not found" });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.query = {
      id_semester: "1",
      id_prodi: "1",
      nama_kelas_kuliah: "Kelas A",
      format: "json",
      tanggal_penandatanganan: "2024-07-21",
    };

    KelasKuliah.findOne.mockRejectedValue(error);

    await getRekapPresensiKelasByFilter(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
