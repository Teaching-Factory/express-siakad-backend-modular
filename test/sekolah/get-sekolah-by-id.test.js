const { getSekolahById } = require("../../src/controllers/sekolah"); // Sesuaikan path controller
const { Sekolah } = require("../../models"); // Sesuaikan path model
const httpMocks = require("node-mocks-http");

describe("getSekolahById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Membersihkan mock setelah setiap pengujian
  });

  it("should return 400 if sekolahId is not provided", async () => {
    // Kosongkan parameter ID
    req.params.id = null;

    // Panggil fungsi getSekolahById
    await getSekolahById(req, res, next);

    // Periksa apakah status 400 dikembalikan
    expect(res.statusCode).toBe(400);

    // Periksa apakah pesan kesalahan dikembalikan
    expect(res._getJSONData()).toEqual({
      message: "Sekolah ID is required"
    });
  });

  it("should return 200 and the sekolah data if found", async () => {
    // Set parameter ID
    const mockSekolahId = 1;
    req.params.id = mockSekolahId;

    // Mock data sekolah yang dikembalikan oleh database
    const mockSekolah = { id: mockSekolahId, sekolah: "SMK 1" };

    // Mock metode findByPk dari Sekolah
    Sekolah.findByPk = jest.fn().mockResolvedValue(mockSekolah);

    // Panggil fungsi getSekolahById
    await getSekolahById(req, res, next);

    // Periksa apakah status 200 dikembalikan
    expect(res.statusCode).toBe(200);

    // Periksa respons JSON
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Sekolah By ID ${mockSekolahId} Success:`,
      data: mockSekolah
    });

    // Pastikan metode findByPk dipanggil dengan ID yang benar
    expect(Sekolah.findByPk).toHaveBeenCalledWith(mockSekolahId);
  });

  it("should return 404 if sekolah is not found", async () => {
    // Set parameter ID
    const mockSekolahId = 1;
    req.params.id = mockSekolahId;

    // Mock findByPk mengembalikan null (data tidak ditemukan)
    Sekolah.findByPk = jest.fn().mockResolvedValue(null);

    // Panggil fungsi getSekolahById
    await getSekolahById(req, res, next);

    // Periksa apakah status 404 dikembalikan
    expect(res.statusCode).toBe(404);

    // Periksa apakah pesan kesalahan dikembalikan
    expect(res._getJSONData()).toEqual({
      message: `<===== Sekolah With ID ${mockSekolahId} Not Found:`
    });

    // Pastikan metode findByPk dipanggil dengan ID yang benar
    expect(Sekolah.findByPk).toHaveBeenCalledWith(mockSekolahId);
  });

  it("should handle errors and call next with error", async () => {
    // Set parameter ID
    const mockSekolahId = 1;
    req.params.id = mockSekolahId;

    // Mock error saat mengakses database
    const mockError = new Error("Database error");
    Sekolah.findByPk = jest.fn().mockRejectedValue(mockError);

    // Panggil fungsi getSekolahById
    await getSekolahById(req, res, next);

    // Periksa apakah fungsi next dipanggil dengan error
    expect(next).toHaveBeenCalledWith(mockError);

    // Pastikan tidak ada respons yang dikirim
    expect(res._isEndCalled()).toBe(false);
  });
});
