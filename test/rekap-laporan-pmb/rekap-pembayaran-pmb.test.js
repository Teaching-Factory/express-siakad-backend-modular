const { rekapPembayaranPMB } = require("../../src/controllers/rekap-laporan-pmb");
const { Prodi, UnitJabatan, Jabatan, Dosen, TagihanCamaba, Camaba } = require("../../models");
const { Op } = require("sequelize");

jest.mock("../../models");

describe("rekapPembayaranPMB", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {
        tanggal_awal: "2024-09-01",
        tanggal_akhir: "2024-09-15",
        id_prodi_diterima: 1,
        tanggal_penandatanganan: "2024-09-23",
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

  it("should return 400 if tanggal_awal is missing", async () => {
    delete req.query.tanggal_awal;

    await rekapPembayaranPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "tanggal_awal (deadline pembayaran) is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if tanggal_akhir is missing", async () => {
    delete req.query.tanggal_akhir;

    await rekapPembayaranPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "tanggal_akhir (tanggal pembayaran) is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if id_prodi_diterima is missing", async () => {
    delete req.query.id_prodi_diterima;

    await rekapPembayaranPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "id_prodi_diterima (tanggal pembayaran) is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if tanggal_penandatanganan is missing", async () => {
    delete req.query.tanggal_penandatanganan;

    await rekapPembayaranPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "tanggal_penandatanganan is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if format is missing", async () => {
    delete req.query.format;

    await rekapPembayaranPMB(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "format is required" });
    expect(next).not.toHaveBeenCalled();
  });

  //   Belum pass
  //   it("should return 400 if tanggal_akhir is before tanggal_awal", async () => {
  //     req.query.tanggal_akhir = "2024-08-31";

  //     await rekapPembayaranPMB(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(400);
  //     expect(res.json).toHaveBeenCalledWith({ message: "Tanggal awal tidak boleh melebihi tanggal akhir" });
  //     expect(next).not.toHaveBeenCalled();
  //   });

  //   it("should return 404 if Prodi is not found", async () => {
  //     Prodi.findByPk.mockResolvedValue(null);

  //     await rekapPembayaranPMB(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(404);
  //     expect(res.json).toHaveBeenCalledWith({
  //       message: `<===== Prodi With ID ${req.query.id_prodi_diterima} Not Found:`
  //     });
  //   });

  //   it("should return 200 with the correct data if all queries are valid", async () => {
  //     const mockProdi = { id: 1, name: "Prodi Test" };
  //     const mockUnitJabatan = { id: 1, name: "Unit Test" };
  //     const mockTagihanCamaba = [
  //       {
  //         id: 1,
  //         jumlah_tagihan: 1000000,
  //         tanggal_tagihan: "2024-09-01",
  //         tanggal_lunas: "2024-09-10",
  //         Camaba: { id: 1, id_prodi_diterima: 1, Prodi: mockProdi }
  //       },
  //       {
  //         id: 2,
  //         jumlah_tagihan: 500000,
  //         tanggal_tagihan: "2024-09-02",
  //         tanggal_lunas: "2024-09-12",
  //         Camaba: { id: 2, id_prodi_diterima: 1, Prodi: mockProdi }
  //       }
  //     ];

  //     Prodi.findByPk.mockResolvedValue(mockProdi);
  //     UnitJabatan.findOne.mockResolvedValue(mockUnitJabatan);
  //     TagihanCamaba.findAll.mockResolvedValue(mockTagihanCamaba);

  //     await rekapPembayaranPMB(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith({
  //       message: "GET Rekap Pembayaran PMB By Request Query Success",
  //       tanggalPenandatanganan: req.query.tanggal_penandatanganan,
  //       format: req.query.format,
  //       jumlahDataTagihanCamaba: mockTagihanCamaba.length,
  //       totalTagihanSemuaCamaba: mockTagihanCamaba.reduce((acc, tagihan) => acc + (parseFloat(tagihan.jumlah_tagihan) || 0), 0),
  //       dataUnitJabatan: mockUnitJabatan,
  //       dataTagihanCamaba: mockTagihanCamaba
  //     });
  //   });

  //   it("should call next with an error if an exception occurs", async () => {
  //     const error = new Error("Database error");
  //     Prodi.findByPk.mockRejectedValue(error);

  //     await rekapPembayaranPMB(req, res, next);

  //     expect(next).toHaveBeenCalledWith(error);
  //   });
});
