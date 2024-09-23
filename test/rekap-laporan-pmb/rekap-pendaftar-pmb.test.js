const { rekapPendaftarPMB } = require("../../src/controllers/rekap-laporan-pmb");
const { PeriodePendaftaran, Camaba, UnitJabatan, ProdiCamaba, Mahasiswa } = require("../../models");

jest.mock("../../models");

describe("rekapPendaftarPMB", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {
        id_semester: 1,
        id_periode_pendaftaran: 1,
        id_prodi_diterima: 1,
        tanggal_penandatanganan: "2024-01-01",
        format: "pdf"
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if id_semester is missing", async () => {
    delete req.query.id_semester;

    await rekapPendaftarPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "id_semester is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if id_periode_pendaftaran is missing", async () => {
    delete req.query.id_periode_pendaftaran;

    await rekapPendaftarPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "id_periode_pendaftaran is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if id_prodi_diterima is missing", async () => {
    delete req.query.id_prodi_diterima;

    await rekapPendaftarPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "id_prodi_diterima is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if tanggal_penandatanganan is missing", async () => {
    delete req.query.tanggal_penandatanganan;

    await rekapPendaftarPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "tanggal_penandatanganan is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if format is missing", async () => {
    delete req.query.format;

    await rekapPendaftarPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "format is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if PeriodePendaftaran is not found", async () => {
    PeriodePendaftaran.findByPk.mockResolvedValue(null);

    await rekapPendaftarPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Periode Pendaftaran is required" });
  });

  //   Belum pass
  //   it("should successfully return the rekap data with status 200", async () => {
  //     const mockPeriodePendaftaran = { id: 1, Semester: {}, JalurMasuk: {}, SistemKuliah: {} };
  //     const mockCamabas = [
  //       { id: 1, status_berkas: true, status_tes: true, nim: "12345", Prodi: {}, BiodataCamaba: {} },
  //       { id: 2, status_berkas: false, status_tes: true, nim: null, Prodi: {}, BiodataCamaba: {} }
  //     ];
  //     const mockUnitJabatan = { id: 1, Jabatan: { nama_jabatan: "Rektor" }, Dosen: {} };
  //     const mockMahasiswa = { nim: "12345" };

  //     PeriodePendaftaran.findByPk.mockResolvedValue(mockPeriodePendaftaran);
  //     Camaba.findAll.mockResolvedValue(mockCamabas);
  //     UnitJabatan.findOne.mockResolvedValue(mockUnitJabatan);
  //     Mahasiswa.findOne.mockResolvedValue(mockMahasiswa);

  //     await rekapPendaftarPMB(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith({
  //       message: "GET Rekap Pendaftar PMB By Request Query Success",
  //       tanggalPenandatanganan: "2024-01-01",
  //       format: "pdf",
  //       totalDataCamaba: 2,
  //       jumlah_pendaftar_lulus_berkas: 1,
  //       jumlah_pendaftar_lulus_tes: 2,
  //       jumlah_pendaftar_sudah_mahasiswa: 1,
  //       dataUnitJabatan: mockUnitJabatan,
  //       dataPeriodePendaftaran: mockPeriodePendaftaran,
  //       dataCamabas: mockCamabas
  //     });
  //   });

  it("should call next with an error if an exception occurs", async () => {
    const errorMock = new Error("Database error");
    PeriodePendaftaran.findByPk.mockRejectedValue(errorMock);

    await rekapPendaftarPMB(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMock);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
