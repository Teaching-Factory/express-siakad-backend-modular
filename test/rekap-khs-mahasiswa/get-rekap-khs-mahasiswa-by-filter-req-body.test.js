const httpMocks = require("node-mocks-http");
const { getRekapKHSMahasiswaByFilterReqBody } = require("../../src/modules/rekap-khs-mahasiswa/controller");
const { Mahasiswa, Angkatan, UnitJabatan, RekapKHSMahasiswa, PerkuliahanMahasiswa, Prodi, Semester, MataKuliah, Jabatan, Dosen } = require("../../models");

jest.mock("../../models");

describe("getRekapKHSMahasiswaByFilterReqBody", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if nim is not provided when jenis_cetak is 'Mahasiswa'", async () => {
    req.query = { jenis_cetak: "Mahasiswa", id_semester: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };

    await getRekapKHSMahasiswaByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "nim is required" });
  });

  it("should return 400 if format is not provided when jenis_cetak is 'Mahasiswa'", async () => {
    req.query = { jenis_cetak: "Mahasiswa", nim: "123456", id_semester: 1, tanggal_penandatanganan: "2024-01-01" };

    await getRekapKHSMahasiswaByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "format is required" });
  });

  it("should return 404 if mahasiswa is not found", async () => {
    req.query = { jenis_cetak: "Mahasiswa", nim: "123456", id_semester: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };
    Mahasiswa.findOne.mockResolvedValue(null);

    await getRekapKHSMahasiswaByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: "<===== Mahasiswa With NIM 123456 Not Found:" });
  });

  it("should return 404 if perkuliahan mahasiswa tidak ditemukan", async () => {
    req.query = { jenis_cetak: "Mahasiswa", nim: "123456", id_semester: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };

    Mahasiswa.findOne.mockResolvedValue({
      id_prodi: 1,
      nim: "123456",
      nama: "Mahasiswa 1",
      id_registrasi_mahasiswa: 10,
    });

    UnitJabatan.findOne.mockResolvedValue(null);

    RekapKHSMahasiswa.findAll.mockResolvedValue([]);

    PerkuliahanMahasiswa.findOne.mockResolvedValue(null); // untuk semester terakhir

    await getRekapKHSMahasiswaByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: "<===== Mahasiswa With NIM 123456 Not Found:" });
  });

  it("should return 200 on success for jenis_cetak 'Mahasiswa'", async () => {
    req.query = { jenis_cetak: "Mahasiswa", nim: "123456", id_semester: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };

    Mahasiswa.findOne.mockResolvedValue({
      id_prodi: 1,
      nim: "123456",
      nama: "Mahasiswa 1",
      id_registrasi_mahasiswa: 10,
    });

    UnitJabatan.findOne.mockResolvedValue({
      id: 1,
      Jabatan: { nama_jabatan: "Dekan" },
      Dosen: { id: 1, nama: "Dosen 1" },
    });

    RekapKHSMahasiswa.findAll.mockResolvedValue([
      { id: 1, id_registrasi_mahasiswa: 10, nilai: "A" },
      { id: 2, id_registrasi_mahasiswa: 10, nilai: "B+" },
    ]);

    PerkuliahanMahasiswa.findOne
      .mockResolvedValueOnce({ id_semester: 2 }) // semester terakhir
      .mockResolvedValueOnce({ id: 100, id_semester: 2, id_registrasi_mahasiswa: 10 }); // data akm

    await getRekapKHSMahasiswaByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toMatchObject({
      message: "Get Rekap KHS Mahasiswa By Mahasiswa Success",
      mahasiswa: expect.any(Object),
      unitJabatan: expect.any(Object),
      tanggalPenandatanganan: "2024-01-01",
      format: "pdf",
      perkuliahanMahasiswa: expect.any(Object),
      totalData: 2,
      dataRekapKHSMahasiswaMahasiswa: expect.any(Array),
    });
  });

  it("should return 400 if id_prodi is not provided for jenis_cetak 'Angkatan'", async () => {
    req.query = { jenis_cetak: "Angkatan", id_angkatan: 1, id_semester: 1, tanggal_penandatanganan: "2024-01-01" };

    await getRekapKHSMahasiswaByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "id_prodi is required" });
  });

  it("should return 404 if angkatan not found", async () => {
    req.query = { jenis_cetak: "Angkatan", id_prodi: 1, id_angkatan: 1, id_semester: 1, tanggal_penandatanganan: "2024-01-01" };

    Angkatan.findByPk.mockResolvedValue(null);

    await getRekapKHSMahasiswaByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: "<===== Angkatan With ID 1 Not Found:" });
  });

  it("should call next with error on exception", async () => {
    req.query = { jenis_cetak: "Mahasiswa", nim: "123456", id_semester: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };
    const error = new Error("Unexpected Error");
    Mahasiswa.findOne.mockRejectedValue(error);

    await getRekapKHSMahasiswaByFilterReqBody(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
