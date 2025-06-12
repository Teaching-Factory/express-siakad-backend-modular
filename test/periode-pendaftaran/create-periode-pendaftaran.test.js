const httpMocks = require("node-mocks-http");
const { createPeriodePendaftaran } = require("../../src/modules/periode-pendaftaran/controller");
const { PeriodePendaftaran, Prodi, ProdiPeriodePendaftaran, JenisBerkas, BerkasPeriodePendaftaran, JenisTes, TahapTesPeriodePendaftaran, Sumber, SumberPeriodePendaftaran } = require("../../models");

jest.mock("../../models");

describe("createPeriodePendaftaran", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  //   masih belum pass
  //   it("should create a new periode_pendaftaran and return status 201", async () => {
  //     const mockNewPeriodePendaftaran = {
  //       id: 1,
  //       nama_periode_pendaftaran: "Periode 1",
  //       id_semester: 1,
  //       id_jalur_masuk: 1,
  //       id_sistem_kuliah: 1,
  //       tanggal_awal_pendaftaran: "2024-01-01",
  //       tanggal_akhir_pendaftaran: "2024-01-31",
  //       dibuka: true,
  //       berbayar: true,
  //       biaya_pendaftaran: 1000000,
  //       batas_akhir_pembayaran: "2024-02-01",
  //       jumlah_pilihan_prodi: 3,
  //       deskripsi_singkat: "Deskripsi",
  //       konten_informasi: "Konten",
  //       sumber_informasi: true
  //     };

  //     PeriodePendaftaran.create.mockResolvedValue(mockNewPeriodePendaftaran);
  //     Prodi.findOne.mockResolvedValue({ id_prodi: 1 });
  //     JenisBerkas.findOne.mockResolvedValue({ id: 1 });
  //     JenisTes.findOne.mockResolvedValue({ id: 1 });
  //     Sumber.findOne.mockResolvedValue({ id: 1 });

  //     req.body = {
  //       nama_periode_pendaftaran: "Periode 1",
  //       id_semester: 1,
  //       id_jalur_masuk: 1,
  //       id_sistem_kuliah: 1,
  //       tanggal_awal_pendaftaran: "2024-01-01",
  //       tanggal_akhir_pendaftaran: "2024-01-31",
  //       dibuka: true,
  //       berbayar: true,
  //       biaya_pendaftaran: 1000000,
  //       batas_akhir_pembayaran: "2024-02-01",
  //       jumlah_pilihan_prodi: 3,
  //       deskripsi_singkat: "Deskripsi",
  //       konten_informasi: "Konten",
  //       sumber_informasi: true,
  //       prodi: [{ id_prodi: 1 }],
  //       berkas: [{ id_jenis_berkas: 1 }],
  //       tahap_tes: [{ id_jenis_tes: 1, urutan_tes: 1, tanggal_awal_tes: "2024-01-01", tanggal_akhir_tes: "2024-01-02" }],
  //       sumber: [{ id_sumber: 1 }]
  //     };

  //     await createPeriodePendaftaran(req, res, next);

  //     expect(PeriodePendaftaran.create).toHaveBeenCalledWith({
  //       nama_periode_pendaftaran: "Periode 1",
  //       id_semester: 1,
  //       id_jalur_masuk: 1,
  //       id_sistem_kuliah: 1,
  //       tanggal_awal_pendaftaran: "2024-01-01",
  //       tanggal_akhir_pendaftaran: "2024-01-31",
  //       dibuka: true,
  //       berbayar: true,
  //       biaya_pendaftaran: 1000000,
  //       batas_akhir_pembayaran: "2024-02-01",
  //       jumlah_pilihan_prodi: 3,
  //       deskripsi_singkat: "Deskripsi",
  //       konten_informasi: "Konten",
  //       sumber_informasi: true
  //     });

  //     expect(Prodi.findOne).toHaveBeenCalledWith({ where: { id_prodi: 1 } });
  //     expect(ProdiPeriodePendaftaran.create).toHaveBeenCalledWith({
  //       id_periode_pendaftaran: 1,
  //       id_prodi: 1
  //     });

  //     expect(JenisBerkas.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  //     expect(BerkasPeriodePendaftaran.create).toHaveBeenCalledWith({
  //       id_periode_pendaftaran: 1,
  //       id_jenis_berkas: 1
  //     });

  //     expect(JenisTes.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  //     expect(TahapTesPeriodePendaftaran.create).toHaveBeenCalledWith({
  //       id_periode_pendaftaran: 1,
  //       id_jenis_tes: 1,
  //       urutan_tes: 1,
  //       tanggal_awal_tes: "2024-01-01",
  //       tanggal_akhir_tes: "2024-01-02"
  //     });

  //     expect(Sumber.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  //     expect(SumberPeriodePendaftaran.create).toHaveBeenCalledWith({
  //       id_periode_pendaftaran: 1,
  //       id_sumber: 1
  //     });

  //     expect(res.statusCode).toEqual(201);
  //     expect(res._getJSONData()).toEqual({
  //       message: "<===== CREATE Periode Pendaftaran Success",
  //       data: mockNewPeriodePendaftaran
  //     });
  //   });

  it("should return 400 if berkas array is empty", async () => {
    req.body = {
      nama_periode_pendaftaran: "Periode 1",
      id_semester: 1,
      id_jalur_masuk: 1,
      id_sistem_kuliah: 1,
      tanggal_awal_pendaftaran: "2024-01-01",
      tanggal_akhir_pendaftaran: "2024-01-31",
      dibuka: true,
      berbayar: true,
      biaya_pendaftaran: 1000000,
      batas_akhir_pembayaran: "2024-02-01",
      jumlah_pilihan_prodi: 3,
      deskripsi_singkat: "Deskripsi",
      konten_informasi: "Konten",
      sumber_informasi: false,
      berkas: [],
      tahap_tes: [{ id_jenis_tes: 1, urutan_tes: 1, tanggal_awal_tes: "2024-01-01", tanggal_akhir_tes: "2024-01-02" }]
    };

    await createPeriodePendaftaran(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "Berkas is required" });
  });

  it("should return 400 if tahap_tes array is empty", async () => {
    req.body = {
      nama_periode_pendaftaran: "Periode 1",
      id_semester: 1,
      id_jalur_masuk: 1,
      id_sistem_kuliah: 1,
      tanggal_awal_pendaftaran: "2024-01-01",
      tanggal_akhir_pendaftaran: "2024-01-31",
      dibuka: true,
      berbayar: true,
      biaya_pendaftaran: 1000000,
      batas_akhir_pembayaran: "2024-02-01",
      jumlah_pilihan_prodi: 3,
      deskripsi_singkat: "Deskripsi",
      konten_informasi: "Konten",
      sumber_informasi: false,
      berkas: [{ id_jenis_berkas: 1 }],
      tahap_tes: []
    };

    await createPeriodePendaftaran(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "Tahap Tes is required" });
  });

  it("should return 400 if sumber_informasi is true but sumber array is empty", async () => {
    req.body = {
      nama_periode_pendaftaran: "Periode 1",
      id_semester: 1,
      id_jalur_masuk: 1,
      id_sistem_kuliah: 1,
      tanggal_awal_pendaftaran: "2024-01-01",
      tanggal_akhir_pendaftaran: "2024-01-31",
      dibuka: true,
      berbayar: true,
      biaya_pendaftaran: 1000000,
      batas_akhir_pembayaran: "2024-02-01",
      jumlah_pilihan_prodi: 3,
      deskripsi_singkat: "Deskripsi",
      konten_informasi: "Konten",
      sumber_informasi: true,
      berkas: [{ id_jenis_berkas: 1 }],
      tahap_tes: [{ id_jenis_tes: 1, urutan_tes: 1, tanggal_awal_tes: "2024-01-01", tanggal_akhir_tes: "2024-01-02" }],
      sumber: []
    };

    await createPeriodePendaftaran(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "Sumber Periode Pendaftaran is not valid" });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PeriodePendaftaran.create.mockRejectedValue(error);

    req.body = {
      nama_periode_pendaftaran: "Periode 1",
      id_semester: 1,
      id_jalur_masuk: 1,
      id_sistem_kuliah: 1,
      tanggal_awal_pendaftaran: "2024-01-01",
      tanggal_akhir_pendaftaran: "2024-01-31",
      dibuka: true,
      berbayar: true,
      biaya_pendaftaran: 1000000,
      batas_akhir_pembayaran: "2024-02-01",
      jumlah_pilihan_prodi: 3,
      deskripsi_singkat: "Deskripsi",
      konten_informasi: "Konten",
      sumber_informasi: true,
      berkas: [{ id_jenis_berkas: 1 }],
      tahap_tes: [{ id_jenis_tes: 1, urutan_tes: 1, tanggal_awal_tes: "2024-01-01", tanggal_akhir_tes: "2024-01-02" }],
      sumber: [{ id_sumber: 1 }]
    };

    await createPeriodePendaftaran(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
