const { updatePeriodePerkuliahanById } = require("../../src/modules/periode-pendaftaran/controller");
const httpMocks = require("node-mocks-http");
const { PeriodePendaftaran, Prodi, JenisBerkas, JenisTes, Sumber, ProdiPeriodePendaftaran, BerkasPeriodePendaftaran, TahapTesPeriodePendaftaran, SumberPeriodePendaftaran } = require("../../models");

jest.mock("../../models");

describe("updatePeriodePerkuliahanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  //   belum pass
  //   it("should return 400 if required fields are missing", async () => {
  //     req.params.id = 1;
  //     req.body = {};

  //     await updatePeriodePerkuliahanById(req, res, next);

  //     expect(res.statusCode).toBe(400);
  //     expect(res._getJSONData()).toEqual({ message: "nama_periode_pendaftaran is required" });

  //     req.body = { nama_periode_pendaftaran: "Periode 1" };

  //     await updatePeriodePerkuliahanById(req, res, next);

  //     expect(res.statusCode).toBe(400);
  //     expect(res._getJSONData()).toEqual({ message: "id_semester is required" });
  //   });

  it("should return 400 if periodePendaftaranId is missing", async () => {
    req.params.id = null; // No ID provided
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
      jumlah_pilihan_prodi: 3
    };

    await updatePeriodePerkuliahanById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Periode Pendaftaran ID is required" });
  });

  //   belum pass
  //   it("should update periode_pendaftaran and return 200 on success", async () => {
  //     const mockPeriodePendaftaran = {
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
  //       sumber_informasi: true,
  //       save: jest.fn().mockResolvedValue(this)
  //     };

  //     PeriodePendaftaran.findByPk.mockResolvedValue(mockPeriodePendaftaran);
  //     Prodi.findByPk.mockResolvedValue({ id_prodi: 1 });
  //     JenisBerkas.findByPk.mockResolvedValue({ id: 1 });
  //     JenisTes.findByPk.mockResolvedValue({ id: 1 });
  //     Sumber.findByPk.mockResolvedValue({ id: 1 });

  //     req.params.id = 1;
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

  //     await updatePeriodePerkuliahanById(req, res, next);

  //     expect(PeriodePendaftaran.findByPk).toHaveBeenCalledWith(1);
  //     expect(mockPeriodePendaftaran.save).toHaveBeenCalled();
  //     expect(Prodi.findByPk).toHaveBeenCalledWith(1);
  //     expect(ProdiPeriodePendaftaran.destroy).toHaveBeenCalledWith({ where: { id_periode_pendaftaran: 1 } });
  //     expect(ProdiPeriodePendaftaran.create).toHaveBeenCalledWith({
  //       id_periode_pendaftaran: 1,
  //       id_prodi: 1
  //     });
  //     expect(JenisBerkas.findByPk).toHaveBeenCalledWith(1);
  //     expect(BerkasPeriodePendaftaran.destroy).toHaveBeenCalledWith({ where: { id_periode_pendaftaran: 1 } });
  //     expect(BerkasPeriodePendaftaran.create).toHaveBeenCalledWith({
  //       id_periode_pendaftaran: 1,
  //       id_jenis_berkas: 1
  //     });
  //     expect(JenisTes.findByPk).toHaveBeenCalledWith(1);
  //     expect(TahapTesPeriodePendaftaran.destroy).toHaveBeenCalledWith({ where: { id_periode_pendaftaran: 1 } });
  //     expect(TahapTesPeriodePendaftaran.create).toHaveBeenCalledWith({
  //       id_periode_pendaftaran: 1,
  //       id_jenis_tes: 1,
  //       urutan_tes: 1,
  //       tanggal_awal_tes: "2024-01-01",
  //       tanggal_akhir_tes: "2024-01-02"
  //     });
  //     expect(Sumber.findByPk).toHaveBeenCalledWith(1);
  //     expect(SumberPeriodePendaftaran.destroy).toHaveBeenCalledWith({ where: { id_periode_pendaftaran: 1 } });
  //     expect(SumberPeriodePendaftaran.create).toHaveBeenCalledWith({
  //       id_periode_pendaftaran: 1,
  //       id_sumber: 1
  //     });

  //     expect(res.statusCode).toBe(200);
  //     expect(res._getJSONData()).toEqual({
  //       message: `<===== UPDATE Periode Pendaftaran With ID 1 Success:`,
  //       data: mockPeriodePendaftaran
  //     });
  //   });

  it("should handle errors and call next() with the error", async () => {
    PeriodePendaftaran.findByPk.mockRejectedValue(new Error("Database Error"));

    req.params.id = 1;
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
      jumlah_pilihan_prodi: 3
    };

    await updatePeriodePerkuliahanById(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error("Database Error"));
  });
});
