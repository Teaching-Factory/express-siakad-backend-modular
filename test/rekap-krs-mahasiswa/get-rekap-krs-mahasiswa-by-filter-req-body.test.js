const { getRekapKRSMahasiswaByFilterReqBody } = require("../../src/modules/rekap-krs-mahasiswa/controller");
const { Mahasiswa, UnitJabatan, KRSMahasiswa, Angkatan, Semester, Prodi, Jabatan, Dosen, KelasKuliah, DetailKelasKuliah, RuangPerkuliahan, MataKuliah, DosenWali, SemesterAktif, TahunAjaran } = require("../../models");

jest.mock("../../models");

describe("getRekapKRSMahasiswaByFilterReqBody", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
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

  it("should return 400 if jenis_cetak is 'Mahasiswa' and nim is missing", async () => {
    req.query = { jenis_cetak: "Mahasiswa", id_semester: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };

    await getRekapKRSMahasiswaByFilterReqBody(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "nim is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if mahasiswa not found", async () => {
    req.query = { jenis_cetak: "Mahasiswa", nim: "123456", id_semester: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };
    Mahasiswa.findOne.mockResolvedValue(null);

    await getRekapKRSMahasiswaByFilterReqBody(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: `<===== Mahasiswa With NIM 123456 Not Found:` });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if jenis_cetak is 'Angkatan' and id_prodi is missing", async () => {
    req.query = { jenis_cetak: "Angkatan", id_angkatan: 1, id_semester: 1, tanggal_penandatanganan: "2024-01-01", format: "pdf" };

    await getRekapKRSMahasiswaByFilterReqBody(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "id_prodi is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if angkatan not found", async () => {
    req.query = { jenis_cetak: "Angkatan", id_prodi: 1, id_angkatan: 1, id_semester: 1, tanggal_penandatanganan: "2024-01-01", format: "pdf" };
    Angkatan.findByPk.mockResolvedValue(null);

    await getRekapKRSMahasiswaByFilterReqBody(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: `<===== Angkatan With ID 1 Not Found:` });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if jenis_cetak is invalid", async () => {
    req.query = { jenis_cetak: "Invalid", id_prodi: 1, id_angkatan: 1, id_semester: 1, tanggal_penandatanganan: "2024-01-01", format: "pdf" };

    await getRekapKRSMahasiswaByFilterReqBody(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "jenis_cetak is invalid" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error if database operation fails", async () => {
    req.query = { jenis_cetak: "Mahasiswa", nim: "123456", id_semester: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };

    const errorMock = new Error("Database connection error");
    Mahasiswa.findOne.mockRejectedValue(errorMock);

    await getRekapKRSMahasiswaByFilterReqBody(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMock);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
