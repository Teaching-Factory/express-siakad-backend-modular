const httpMocks = require("node-mocks-http");
const { getAllPembayaranMahasiswaByTagihanId } = require("../../src/modules/pembayaran-mahasiswa/controller");
const { PembayaranMahasiswa, TagihanMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getAllPembayaranMahasiswaByTagihanId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get all pembayaran mahasiswa by tagihan mahasiswa ID and return 200", async () => {
    const mockTagihanMahasiswaId = 1;

    req.params.id_tagihan_mahasiswa = mockTagihanMahasiswaId;

    const mockPembayaranMahasiswa = [
      {
        id: 1,
        jumlah_pembayaran: 500000,
        metode_pembayaran: "Transfer Bank",
        tanggal_pembayaran: "2024-06-10",
        id_tagihan_mahasiswa: mockTagihanMahasiswaId,
        TagihanMahasiswa: {
          id: mockTagihanMahasiswaId,
          jumlah_tagihan: 500000,
          jenis_tagihan: "SPP",
          tanggal_tagihan: "2024-06-10",
          deadline_tagihan: "2024-07-10",
          status_tagihan: "Lunas",
          id_periode: 1,
          id_registrasi_mahasiswa: 1,
        },
      },
    ];

    PembayaranMahasiswa.findAll.mockResolvedValue(mockPembayaranMahasiswa);

    await getAllPembayaranMahasiswaByTagihanId(req, res, next);

    expect(PembayaranMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_tagihan_mahasiswa: mockTagihanMahasiswaId,
      },
      include: [{ model: TagihanMahasiswa }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET All Pembayaran Mahasiswa By Id ${mockTagihanMahasiswaId} Success`,
      jumlahData: mockPembayaranMahasiswa.length,
      data: mockPembayaranMahasiswa,
    });
  });

  it("should return 400 if tagihan mahasiswa ID is missing", async () => {
    req.params.id_tagihan_mahasiswa = undefined;

    await getAllPembayaranMahasiswaByTagihanId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Tagihan Mahasiswa ID is required",
    });
    expect(PembayaranMahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const mockTagihanMahasiswaId = 1;

    req.params.id_tagihan_mahasiswa = mockTagihanMahasiswaId;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PembayaranMahasiswa.findAll.mockRejectedValue(error);

    await getAllPembayaranMahasiswaByTagihanId(req, res, next);

    expect(PembayaranMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        id_tagihan_mahasiswa: mockTagihanMahasiswaId,
      },
      include: [{ model: TagihanMahasiswa }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
