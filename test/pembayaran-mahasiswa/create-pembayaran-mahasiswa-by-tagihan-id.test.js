const httpMocks = require("node-mocks-http");
const { createPembayaranMahasiswaByTagihanId } = require("../../src/controllers/pembayaran-mahasiswa");
const { PembayaranMahasiswa } = require("../../models");

jest.mock("../../models");

describe("createPembayaranMahasiswaByTagihanId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create pembayaran mahasiswa and return 201", async () => {
    const mockTagihanMahasiswaId = 1;
    const mockFile = {
      filename: "bukti_tf.jpg",
    };

    req.params.id_tagihan_mahasiswa = mockTagihanMahasiswaId;
    req.file = mockFile;

    const protocol = process.env.PROTOCOL || "http";
    const host = process.env.HOST || "localhost";
    const port = process.env.PORT || 4000;
    const fileUrl = `${protocol}://${host}:${port}/src/storage/bukti-tagihan-pembayaran/${mockFile.filename}`;

    const mockNewPembayaranMahasiswa = {
      id: 1,
      upload_bukti_tf: fileUrl,
      status_pembayaran: "Menunggu Konfirmasi",
      id_tagihan_mahasiswa: mockTagihanMahasiswaId,
    };

    PembayaranMahasiswa.create.mockResolvedValue(mockNewPembayaranMahasiswa);

    await createPembayaranMahasiswaByTagihanId(req, res, next);

    expect(PembayaranMahasiswa.create).toHaveBeenCalledWith({
      upload_bukti_tf: fileUrl,
      status_pembayaran: "Menunggu Konfirmasi",
      id_tagihan_mahasiswa: mockTagihanMahasiswaId,
    });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Pembayaran Mahasiswa Success",
      data: mockNewPembayaranMahasiswa,
    });
  });

  it("should return 400 if tagihan mahasiswa ID is missing", async () => {
    req.params.id_tagihan_mahasiswa = undefined;

    await createPembayaranMahasiswaByTagihanId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Tagihan Mahasiswa ID is required",
    });
    expect(PembayaranMahasiswa.create).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const mockTagihanMahasiswaId = 1;
    const mockFile = {
      filename: "bukti_tf.jpg",
    };

    req.params.id_tagihan_mahasiswa = mockTagihanMahasiswaId;
    req.file = mockFile;

    const protocol = process.env.PROTOCOL || "http";
    const host = process.env.HOST || "localhost";
    const port = process.env.PORT || 4000;
    const fileUrl = `${protocol}://${host}:${port}/src/storage/bukti-tagihan-pembayaran/${mockFile.filename}`;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PembayaranMahasiswa.create.mockRejectedValue(error);

    await createPembayaranMahasiswaByTagihanId(req, res, next);

    expect(PembayaranMahasiswa.create).toHaveBeenCalledWith({
      upload_bukti_tf: fileUrl,
      status_pembayaran: "Menunggu Konfirmasi",
      id_tagihan_mahasiswa: mockTagihanMahasiswaId,
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
