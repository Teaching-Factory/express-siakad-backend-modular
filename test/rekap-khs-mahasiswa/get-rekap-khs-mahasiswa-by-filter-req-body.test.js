const httpMocks = require("node-mocks-http");
const { getRekapKHSMahasiswaByFilterReqBody } = require("../../src/controllers/rekap-khs-mahasiswa");
const { Mahasiswa, Angkatan, UnitJabatan, RekapKHSMahasiswa, Periode } = require("../../models");

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

  it("should return 404 if mahasiswa is not found when jenis_cetak is 'Mahasiswa'", async () => {
    req.query = { jenis_cetak: "Mahasiswa", nim: "123456", id_semester: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };

    Mahasiswa.findOne.mockResolvedValue(null);

    await getRekapKHSMahasiswaByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: "<===== Mahasiswa With NIM 123456 Not Found:" });
  });

  // it("should return 200 and rekap KHS mahasiswa data on success when jenis_cetak is 'Mahasiswa'", async () => {
  //   req.query = { jenis_cetak: "Mahasiswa", nim: "123456", id_semester: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };

  //   Mahasiswa.findOne.mockResolvedValue({
  //     id_prodi: 1,
  //     nim: "123456",
  //     nama: "Mahasiswa 1",
  //   });

  //   UnitJabatan.findOne.mockResolvedValue({
  //     id: 1,
  //     Jabatan: { nama_jabatan: "Dekan" },
  //     Dosen: { id: 1, nama: "Dosen 1" },
  //   });

  //   RekapKHSMahasiswa.findAll.mockResolvedValue([
  //     { id: 1, id_registrasi_mahasiswa: 1, nilai: "A" },
  //     { id: 2, id_registrasi_mahasiswa: 1, nilai: "B+" },
  //   ]);

  //   await getRekapKHSMahasiswaByFilterReqBody(req, res, next);

  //   expect(res.statusCode).toEqual(200);
  //   expect(res._getJSONData()).toEqual({
  //     message: "Get Rekap KHS Mahasiswa By Mahasiswa from Feeder Success",
  //     mahasiswa: { id_prodi: 1, nim: "123456", nama: "Mahasiswa 1" },
  //     unitJabatan: { id: 1, Jabatan: { nama_jabatan: "Dekan" }, Dosen: { id: 1, nama: "Dosen 1" } },
  //     tanggalPenandatanganan: "2024-01-01",
  //     format: "pdf",
  //     totalData: 2,
  //     dataRekapKHSMahasiswaMahasiswa: [
  //       { id: 1, id_registrasi_mahasiswa: 1, nilai: "A" },
  //       { id: 2, id_registrasi_mahasiswa: 1, nilai: "B+" },
  //     ],
  //   });
  // });

  it("should return 400 if id_prodi is not provided when jenis_cetak is 'Angkatan'", async () => {
    req.query = { jenis_cetak: "Angkatan", id_angkatan: 1, id_semester: 1, tanggal_penandatanganan: "2024-01-01" };

    await getRekapKHSMahasiswaByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "id_prodi is required" });
  });

  it("should return 404 if angkatan is not found when jenis_cetak is 'Angkatan'", async () => {
    req.query = { jenis_cetak: "Angkatan", id_prodi: 1, id_angkatan: 1, id_semester: 1, tanggal_penandatanganan: "2024-01-01" };

    Angkatan.findByPk.mockResolvedValue(null);

    await getRekapKHSMahasiswaByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: "<===== Angkatan With ID 1 Not Found:" });
  });

  it("should return 200 and rekap KHS mahasiswa data on success when jenis_cetak is 'Angkatan'", async () => {
    req.query = { jenis_cetak: "Angkatan", id_prodi: 1, id_angkatan: 1, id_semester: 1, tanggal_penandatanganan: "2024-01-01" };

    Angkatan.findByPk.mockResolvedValue({ tahun: 2020 });

    UnitJabatan.findOne.mockResolvedValue({
      id: 1,
      Jabatan: { nama_jabatan: "Dekan" },
      Dosen: { id: 1, nama: "Dosen 1" },
    });

    RekapKHSMahasiswa.findAll.mockResolvedValue([
      { id: 1, id_registrasi_mahasiswa: 1, nilai: "A" },
      { id: 2, id_registrasi_mahasiswa: 2, nilai: "B+" },
    ]);

    await getRekapKHSMahasiswaByFilterReqBody(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "Get Rekap KHS Mahasiswa By Angkatan from Feeder Success",
      unitJabatan: { id: 1, Jabatan: { nama_jabatan: "Dekan" }, Dosen: { id: 1, nama: "Dosen 1" } },
      tanggalPenandatanganan: "2024-01-01",
      totalData: 2,
      dataRekapKHSMahasiswaAngkatan: {
        1: [{ id: 1, id_registrasi_mahasiswa: 1, nilai: "A" }],
        2: [{ id: 2, id_registrasi_mahasiswa: 2, nilai: "B+" }],
      },
    });
  });

  it("should call next with error when an exception occurs", async () => {
    const mockError = new Error("Something went wrong");
    Mahasiswa.findOne.mockRejectedValue(mockError);

    req.query = { jenis_cetak: "Mahasiswa", nim: "123456", id_semester: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };

    await getRekapKHSMahasiswaByFilterReqBody(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
