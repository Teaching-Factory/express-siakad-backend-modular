const httpMocks = require("node-mocks-http");
const { validasiTagihanCamabaKolektif } = require("../../src/controllers/tagihan-camaba");
const { TagihanCamaba } = require("../../models");

jest.mock("../../models");

describe("validasiTagihanCamabaKolektif", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if tagihan_camabas is not an array or is empty", async () => {
    req.body.tagihan_camabas = []; // Kasus tagihan_camabas kosong

    await validasiTagihanCamabaKolektif(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Tagihan camabas is required" });
  });

  it("should return 404 if tagihan_camaba is not found", async () => {
    req.body.tagihan_camabas = [{ id: 1 }];
    TagihanCamaba.findOne.mockResolvedValue(null); // Tidak menemukan data

    await validasiTagihanCamabaKolektif(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: "Tagihan Camaba with ID 1 not found" });
  });

  it("should update tagihan_camaba status to 'Lunas' and return 200", async () => {
    req.body.tagihan_camabas = [{ id: 1 }];
    const mockTagihanCamaba = {
      id: 1,
      status_tagihan: "Belum Bayar",
      validasi_tagihan: false,
      save: jest.fn().mockResolvedValue(true)
    };

    TagihanCamaba.findOne.mockResolvedValue(mockTagihanCamaba); // Mengembalikan objek tagihan

    await validasiTagihanCamabaKolektif(req, res, next);

    expect(mockTagihanCamaba.status_tagihan).toBe("Lunas");
    expect(mockTagihanCamaba.validasi_tagihan).toBe(true);
    expect(mockTagihanCamaba.tanggal_lunas).toBeInstanceOf(Date); // Pastikan tanggal_lunas di-set
    expect(mockTagihanCamaba.save).toHaveBeenCalled(); // Memastikan save dipanggil

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Tagihan Camaba Kolektif Success:`,
      data: req.body.tagihan_camabas
    });
  });

  it("should handle errors", async () => {
    req.body.tagihan_camabas = [{ id: 1 }];
    const mockTagihanCamaba = {
      id: 1,
      save: jest.fn().mockRejectedValue(new Error("Database error"))
    };

    TagihanCamaba.findOne.mockResolvedValue(mockTagihanCamaba); // Mengembalikan objek tagihan

    await validasiTagihanCamabaKolektif(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error)); // Memastikan error ditangani
  });
});
