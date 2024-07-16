const { getRekapKRSMahasiswaByFilterReqBody } = require("../../src/controllers/rekap-krs-mahasiswa");
const { Mahasiswa, UnitJabatan, KRSMahasiswa, Angkatan, Semester, Prodi, Jabatan, Dosen, KelasKuliah, DetailKelasKuliah } = require("../../models");

jest.mock("../../models");

describe("getRekapKRSMahasiswaByFilterReqBody", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
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
    req.body = { jenis_cetak: "Mahasiswa", id_semester: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };

    await getRekapKRSMahasiswaByFilterReqBody(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "nim is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if mahasiswa not found", async () => {
    req.body = { jenis_cetak: "Mahasiswa", nim: "123456", id_semester: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };
    Mahasiswa.findOne.mockResolvedValue(null);

    await getRekapKRSMahasiswaByFilterReqBody(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "<===== Mahasiswa With NIM 123456 Not Found:" });
    expect(next).not.toHaveBeenCalled();
  });

  //   belum fix
  //   it("should return 200 and rekap KRS mahasiswa data on success when jenis_cetak is 'Mahasiswa'", async () => {
  //     req.body = { jenis_cetak: "Mahasiswa", nim: "123456", id_semester: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };

  //     const mahasiswaMock = { nim: "123456", id_prodi: 1, id_semester: "20231", id_registrasi_mahasiswa: 1 };
  //     Mahasiswa.findOne.mockResolvedValue(mahasiswaMock);

  //     const unitJabatanMock = { id: 1, Jabatan: { nama_jabatan: "Dekan" }, Dosen: { id: 1, nama: "Dosen 1" } };
  //     UnitJabatan.findOne.mockResolvedValue(unitJabatanMock);

  //     const krsMock = [{ id_registrasi_mahasiswa: 1, KelasKuliah: { DetailKelasKuliah: [] } }];
  //     KRSMahasiswa.findAll.mockResolvedValue(krsMock);

  //     await getRekapKRSMahasiswaByFilterReqBody(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith({
  //       message: "Get Rekap KRS Mahasiswa By Mahasiswa from Local Success",
  //       mahasiswa: mahasiswaMock,
  //       unitJabatan: unitJabatanMock,
  //       tanggalPenandatanganan: "2024-01-01",
  //       format: "pdf",
  //       totalData: krsMock.length,
  //       dataRekapKRSByMahasiswa: krsMock,
  //     });
  //     expect(next).not.toHaveBeenCalled();
  //   });

  it("should return 400 if jenis_cetak is 'Angkatan' and id_prodi is missing", async () => {
    req.body = { jenis_cetak: "Angkatan", id_angkatan: 1, id_semester: 1, tanggal_penandatanganan: "2024-01-01", format: "pdf" };

    await getRekapKRSMahasiswaByFilterReqBody(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "id_prodi is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if angkatan not found", async () => {
    req.body = { jenis_cetak: "Angkatan", id_prodi: 1, id_angkatan: 1, id_semester: 1, tanggal_penandatanganan: "2024-01-01", format: "pdf" };
    Angkatan.findByPk.mockResolvedValue(null);

    await getRekapKRSMahasiswaByFilterReqBody(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "<===== Angkatan With ID 1 Not Found:" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 200 and rekap KRS mahasiswa data on success when jenis_cetak is 'Angkatan'", async () => {
    req.body = { jenis_cetak: "Angkatan", id_prodi: 1, id_angkatan: 1, id_semester: 1, tanggal_penandatanganan: "2024-01-01", format: "pdf" };

    const angkatanMock = { tahun: "2023" };
    Angkatan.findByPk.mockResolvedValue(angkatanMock);

    const unitJabatanMock = { id: 1, Jabatan: { nama_jabatan: "Dekan" }, Dosen: { id: 1, nama: "Dosen 1" } };
    UnitJabatan.findOne.mockResolvedValue(unitJabatanMock);

    const krsMock = [{ id_registrasi_mahasiswa: 1, KelasKuliah: { DetailKelasKuliah: [] } }];
    KRSMahasiswa.findAll.mockResolvedValue(krsMock);

    const groupedData = {
      1: krsMock,
    };

    await getRekapKRSMahasiswaByFilterReqBody(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Get Rekap KRS Mahasiswa By Angkatan from Local Success",
      unitJabatan: unitJabatanMock,
      tanggalPenandatanganan: "2024-01-01",
      format: "pdf",
      totalData: Object.keys(groupedData).length,
      dataRekapKRSByMahasiswa: groupedData,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if jenis_cetak is invalid", async () => {
    req.body = { jenis_cetak: "Invalid", id_prodi: 1, id_angkatan: 1, id_semester: 1, tanggal_penandatanganan: "2024-01-01", format: "pdf" };

    await getRekapKRSMahasiswaByFilterReqBody(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "jenis_cetak is invalid" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error if database operation fails", async () => {
    req.body = { jenis_cetak: "Mahasiswa", nim: "123456", id_semester: 1, format: "pdf", tanggal_penandatanganan: "2024-01-01" };

    const errorMock = new Error("Database connection error");
    Mahasiswa.findOne.mockRejectedValue(errorMock);

    await getRekapKRSMahasiswaByFilterReqBody(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMock);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
