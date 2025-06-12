const httpMocks = require("node-mocks-http");
const { getPembayaranMahasiswaById } = require("../../src/modules/pembayaran-mahasiswa/controller");
const { PembayaranMahasiswa, TagihanMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getPembayaranMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get pembayaran mahasiswa by ID and return 200", async () => {
    const mockPembayaranMahasiswaId = 1;

    req.params.id = mockPembayaranMahasiswaId;

    const mockPembayaranMahasiswa = {
      id: mockPembayaranMahasiswaId,
      jumlah_pembayaran: 500000,
      metode_pembayaran: "Transfer Bank",
      tanggal_pembayaran: "2024-06-10",
      id_tagihan_mahasiswa: 1,
      TagihanMahasiswa: {
        id: 1,
        jumlah_tagihan: 500000,
        jenis_tagihan: "SPP",
        tanggal_tagihan: "2024-06-10",
        deadline_tagihan: "2024-07-10",
        status_tagihan: "Lunas",
        id_periode: 1,
        id_registrasi_mahasiswa: 1,
      },
    };

    PembayaranMahasiswa.findByPk.mockResolvedValue(mockPembayaranMahasiswa);

    await getPembayaranMahasiswaById(req, res, next);

    expect(PembayaranMahasiswa.findByPk).toHaveBeenCalledWith(mockPembayaranMahasiswaId, {
      include: [{ model: TagihanMahasiswa }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Pembayaran Mahasiswa By ID ${mockPembayaranMahasiswaId} Success:`,
      data: mockPembayaranMahasiswa,
    });
  });

  it("should return 400 if pembayaran mahasiswa ID is missing", async () => {
    req.params.id = undefined;

    await getPembayaranMahasiswaById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Pembayaran Mahasiswa ID is required",
    });
    expect(PembayaranMahasiswa.findByPk).not.toHaveBeenCalled();
  });

  it("should handle not found scenario", async () => {
    const mockPembayaranMahasiswaId = 999;

    req.params.id = mockPembayaranMahasiswaId;

    PembayaranMahasiswa.findByPk.mockResolvedValue(null);

    await getPembayaranMahasiswaById(req, res, next);

    expect(PembayaranMahasiswa.findByPk).toHaveBeenCalledWith(mockPembayaranMahasiswaId, {
      include: [{ model: TagihanMahasiswa }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Pembayaran Mahasiswa With ID ${mockPembayaranMahasiswaId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const mockPembayaranMahasiswaId = 1;

    req.params.id = mockPembayaranMahasiswaId;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PembayaranMahasiswa.findByPk.mockRejectedValue(error);

    await getPembayaranMahasiswaById(req, res, next);

    expect(PembayaranMahasiswa.findByPk).toHaveBeenCalledWith(mockPembayaranMahasiswaId, {
      include: [{ model: TagihanMahasiswa }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
