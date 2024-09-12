const { getAllSekolah } = require("../../src/controllers/sekolah"); // Sesuaikan path controller
const { Sekolah } = require("../../models"); // Sesuaikan path model
const httpMocks = require("node-mocks-http");

describe("getAllSekolah", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Membersihkan mock setelah setiap pengujian
  });

  it("should return 200 and all sekolahs when found", async () => {
    // Mock data sekolah yang dikembalikan oleh database
    const mockSekolahs = [
      { id: 1, sekolah: "SMK 1" },
      { id: 2, sekolah: "SMK 2" }
    ];

    // Mock metode findAll dari Sekolah
    Sekolah.findAll = jest.fn().mockResolvedValue(mockSekolahs);

    // Panggil fungsi getAllSekolah
    await getAllSekolah(req, res, next);

    // Periksa apakah status 200 dikembalikan
    expect(res.statusCode).toBe(200);

    // Periksa respons JSON
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Sekolah Success",
      jumlahData: mockSekolahs.length,
      data: mockSekolahs
    });

    // Pastikan metode findAll dipanggil satu kali
    expect(Sekolah.findAll).toHaveBeenCalledTimes(1);
    expect(Sekolah.findAll).toHaveBeenCalledWith({
      attributes: ["id", "sekolah"]
    });
  });

  it("should handle errors and call next with error", async () => {
    // Mock error saat mengakses database
    const mockError = new Error("Database error");
    Sekolah.findAll = jest.fn().mockRejectedValue(mockError);

    // Panggil fungsi getAllSekolah
    await getAllSekolah(req, res, next);

    // Periksa apakah fungsi next dipanggil dengan error
    expect(next).toHaveBeenCalledWith(mockError);

    // Pastikan tidak ada respons yang dikirim
    expect(res._isEndCalled()).toBe(false);
  });
});
