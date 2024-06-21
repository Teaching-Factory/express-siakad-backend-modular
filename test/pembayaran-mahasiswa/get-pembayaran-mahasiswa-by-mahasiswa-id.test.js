const httpMocks = require("node-mocks-http");
const { getPembayaranMahasiswaByMahasiswaId } = require("../../src/controllers/pembayaran-mahasiswa");
const { TagihanMahasiswa, PembayaranMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getPembayaranMahasiswaByMahasiswaId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return pembayaran mahasiswa by mahasiswa ID and return 200", async () => {
    const mockIdRegistrasiMahasiswa = 1;
    const mockTagihanMahasiswaId = 1;
    const mockPembayaranMahasiswa = [
      {
        id: 1,
        id_tagihan_mahasiswa: mockTagihanMahasiswaId,
        status_pembayaran: "Lunas",
        TagihanMahasiswa: {
          id_tagihan_mahasiswa: mockTagihanMahasiswaId,
          jumlah_tagihan: 500000,
          jenis_tagihan: "SPP",
          tanggal_tagihan: "2024-06-10",
          deadline_tagihan: "2024-07-10",
          status_tagihan: "Lunas",
          id_periode: 1,
          id_registrasi_mahasiswa: mockIdRegistrasiMahasiswa,
        },
      },
    ];

    req.params.id_registrasi_mahasiswa = mockIdRegistrasiMahasiswa;

    TagihanMahasiswa.findAll.mockResolvedValue([
      {
        id_tagihan_mahasiswa: mockTagihanMahasiswaId,
      },
    ]);

    PembayaranMahasiswa.findAll.mockResolvedValue(mockPembayaranMahasiswa);

    await getPembayaranMahasiswaByMahasiswaId(req, res, next);

    expect(TagihanMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_registrasi_mahasiswa: mockIdRegistrasiMahasiswa,
      },
    });

    expect(PembayaranMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_tagihan_mahasiswa: [mockTagihanMahasiswaId],
      },
      include: [{ model: TagihanMahasiswa }],
    });

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Pembayaran Mahasiswa By ID ${mockIdRegistrasiMahasiswa} Success:`,
      jumlahData: mockPembayaranMahasiswa.length,
      data: mockPembayaranMahasiswa,
    });
  });

  it("should return 404 if pembayaran mahasiswa not found", async () => {
    const mockIdRegistrasiMahasiswa = 999; // Non-existent ID

    req.params.id_registrasi_mahasiswa = mockIdRegistrasiMahasiswa;

    TagihanMahasiswa.findAll.mockResolvedValue([]);

    await getPembayaranMahasiswaByMahasiswaId(req, res, next);

    expect(TagihanMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_registrasi_mahasiswa: mockIdRegistrasiMahasiswa,
      },
    });

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Pembayaran Mahasiswa With ID ${mockIdRegistrasiMahasiswa} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const mockIdRegistrasiMahasiswa = 1;

    req.params.id_registrasi_mahasiswa = mockIdRegistrasiMahasiswa;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    TagihanMahasiswa.findAll.mockRejectedValue(error);

    await getPembayaranMahasiswaByMahasiswaId(req, res, next);

    expect(TagihanMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_registrasi_mahasiswa: mockIdRegistrasiMahasiswa,
      },
    });

    expect(next).toHaveBeenCalledWith(error);
  });
});
