const httpMocks = require("node-mocks-http");
const { updatePembayaranMahasiswaById } = require("../../src/controllers/pembayaran-mahasiswa");
const { PembayaranMahasiswa } = require("../../models");

jest.mock("../../models");

describe("updatePembayaranMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should update pembayaran mahasiswa and return updated data", async () => {
    const mockPembayaranMahasiswaId = 1;
    const mockStatusPembayaran = "Lunas";

    req.params.id = mockPembayaranMahasiswaId;
    req.body.status_pembayaran = mockStatusPembayaran;

    const mockPembayaranMahasiswa = {
      id: mockPembayaranMahasiswaId,
      status_pembayaran: "Menunggu Konfirmasi",
    };

    const updatedPembayaranMahasiswa = {
      ...mockPembayaranMahasiswa,
      status_pembayaran: mockStatusPembayaran,
    };

    // Mock save method
    mockPembayaranMahasiswa.save = jest.fn().mockResolvedValue(updatedPembayaranMahasiswa);

    PembayaranMahasiswa.findByPk.mockResolvedValue(mockPembayaranMahasiswa);

    await updatePembayaranMahasiswaById(req, res, next);

    expect(PembayaranMahasiswa.findByPk).toHaveBeenCalledWith(mockPembayaranMahasiswaId);
    expect(mockPembayaranMahasiswa.save).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "UPDATE Pembayaran Mahasiswa Success",
      dataPembayaranMahasiswa: updatedPembayaranMahasiswa,
    });
  });

  it("should return 400 if status_pembayaran is missing", async () => {
    const mockPembayaranMahasiswaId = 1;

    // Inisialisasi mockPembayaranMahasiswa
    const mockPembayaranMahasiswa = {
      id: mockPembayaranMahasiswaId,
      status_pembayaran: "Menunggu Konfirmasi",
      save: jest.fn(), // Mocking save function
    };

    req.params.id = mockPembayaranMahasiswaId;
    req.body.status_pembayaran = undefined;

    // Mock findByPk untuk mengembalikan mockPembayaranMahasiswa
    PembayaranMahasiswa.findByPk.mockResolvedValue(mockPembayaranMahasiswa);

    // Panggil fungsi updatePembayaranMahasiswaById
    await updatePembayaranMahasiswaById(req, res, next);

    // Assert status code 400
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "status_pembayaran is required",
    });

    // Pastikan findByPk tidak dipanggil
    expect(PembayaranMahasiswa.findByPk).not.toHaveBeenCalled();

    // Pastikan save tidak dipanggil (tidak relevan dalam kasus ini)
    expect(mockPembayaranMahasiswa.save).not.toHaveBeenCalled();
  });

  it("should return 400 if Pembayaran Mahasiswa ID is missing", async () => {
    const mockPembayaranMahasiswaId = undefined;

    // Inisialisasi mockPembayaranMahasiswa
    const mockPembayaranMahasiswa = {
      id: mockPembayaranMahasiswaId,
      status_pembayaran: "Menunggu Konfirmasi",
      save: jest.fn(), // Mocking save function
    };

    req.params.id = mockPembayaranMahasiswaId;
    req.body.status_pembayaran = mockPembayaranMahasiswa.status_pembayaran;

    await updatePembayaranMahasiswaById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Pembayaran Mahasiswa ID is required",
    });

    // Pastikan findByPk tidak dipanggil
    expect(PembayaranMahasiswa.findByPk).not.toHaveBeenCalled();

    // Pastikan save tidak dipanggil (tidak relevan dalam kasus ini)
    expect(mockPembayaranMahasiswa.save).not.toHaveBeenCalled();
  });

  it("should return 404 if Pembayaran Mahasiswa is not found", async () => {
    const mockPembayaranMahasiswaId = 999;

    // Inisialisasi mockPembayaranMahasiswa
    const mockPembayaranMahasiswa = {
      id: mockPembayaranMahasiswaId,
      status_pembayaran: "Menunggu Konfirmasi",
      save: jest.fn(), // Mocking save function
    };

    req.params.id = mockPembayaranMahasiswaId;
    req.body.status_pembayaran = mockPembayaranMahasiswa.status_pembayaran;

    PembayaranMahasiswa.findByPk.mockResolvedValue(null);

    await updatePembayaranMahasiswaById(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Pembayaran Mahasiswa tidak ditemukan",
    });
    expect(mockPembayaranMahasiswa.save).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const mockPembayaranMahasiswaId = 1;
    const mockStatusPembayaran = "Lunas";

    req.params.id = mockPembayaranMahasiswaId;
    req.body.status_pembayaran = mockStatusPembayaran;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PembayaranMahasiswa.findByPk.mockRejectedValue(error);

    await updatePembayaranMahasiswaById(req, res, next);

    expect(PembayaranMahasiswa.findByPk).toHaveBeenCalledWith(mockPembayaranMahasiswaId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
