const httpMocks = require("node-mocks-http");
const { getAllPembayaranMahasiswaDikonfirmasi } = require("../../src/controllers/pembayaran-mahasiswa");
const { PembayaranMahasiswa, TagihanMahasiswa, JenisTagihan, Mahasiswa, Periode } = require("../../models");

jest.mock("../../models");

describe("getAllPembayaranMahasiswaDikonfirmasi", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get all confirmed Pembayaran Mahasiswa", async () => {
    const mockPembayaranMahasiswa = [
      {
        id: 1,
        status_pembayaran: "Dikonfirmasi",
        TagihanMahasiswa: {
          id_tagihan_mahasiswa: 1,
          jumlah_tagihan: 500000,
        },
      },
      {
        id: 2,
        status_pembayaran: "Dikonfirmasi",
        TagihanMahasiswa: {
          id_tagihan_mahasiswa: 2,
          jumlah_tagihan: 750000,
        },
      },
    ];

    PembayaranMahasiswa.findAll.mockResolvedValue(mockPembayaranMahasiswa);

    await getAllPembayaranMahasiswaDikonfirmasi(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Pembayaran Mahasiswa Dikonfirmasi Success",
      jumlahData: mockPembayaranMahasiswa.length,
      data: mockPembayaranMahasiswa,
    });

    expect(PembayaranMahasiswa.findAll).toHaveBeenCalledWith({
      where: {
        status_pembayaran: "Dikonfirmasi",
      },
      include: [{ model: TagihanMahasiswa, include: [{ model: JenisTagihan }, { model: Periode }, { model: Mahasiswa }] }],
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PembayaranMahasiswa.findAll.mockRejectedValue(error);

    await getAllPembayaranMahasiswaDikonfirmasi(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
