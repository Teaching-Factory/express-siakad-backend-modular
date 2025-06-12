const { getAllSekolahSMA } = require("../../src/modules/sekolah/controller"); 
const { Sekolah } = require("../../models"); 
const httpMocks = require("node-mocks-http");

describe("getAllSekolahSMA", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Membersihkan mock setelah setiap pengujian
  });

  it("should return 200 and all SMA schools", async () => {
    // Mock data sekolah SMA yang dikembalikan oleh database
    const mockSekolahSMA = [
      { id: 1, sekolah: "SMA 1" },
      { id: 2, sekolah: "SMA 2" }
    ];

    // Mock metode findAll dari Sekolah untuk mengembalikan data SMA
    Sekolah.findAll = jest.fn().mockResolvedValue(mockSekolahSMA);

    // Panggil fungsi getAllSekolahSMA
    await getAllSekolahSMA(req, res, next);

    // Periksa apakah status 200 dikembalikan
    expect(res.statusCode).toBe(200);

    // Periksa apakah pesan yang dikembalikan benar
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Sekolah SMK Success", // Perbaiki pesan jika perlu
      jumlahData: mockSekolahSMA.length,
      data: mockSekolahSMA
    });

    // Pastikan metode findAll dipanggil dengan benar
    expect(Sekolah.findAll).toHaveBeenCalledWith({
      where: { bentuk: "SMA" },
      attributes: ["id", "sekolah"]
    });
  });

  it("should return 200 and empty data if no SMA schools are found", async () => {
    // Mock findAll mengembalikan array kosong
    Sekolah.findAll = jest.fn().mockResolvedValue([]);

    // Panggil fungsi getAllSekolahSMA
    await getAllSekolahSMA(req, res, next);

    // Periksa apakah status 200 dikembalikan
    expect(res.statusCode).toBe(200);

    // Periksa respons JSON jika data kosong
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Sekolah SMK Success", // Perbaiki pesan jika perlu
      jumlahData: 0,
      data: []
    });

    // Pastikan metode findAll dipanggil dengan benar
    expect(Sekolah.findAll).toHaveBeenCalledWith({
      where: { bentuk: "SMA" },
      attributes: ["id", "sekolah"]
    });
  });

  it("should handle errors and call next with error", async () => {
    // Mock error saat mengakses database
    const mockError = new Error("Database error");
    Sekolah.findAll = jest.fn().mockRejectedValue(mockError);

    // Panggil fungsi getAllSekolahSMA
    await getAllSekolahSMA(req, res, next);

    // Periksa apakah fungsi next dipanggil dengan error
    expect(next).toHaveBeenCalledWith(mockError);

    // Pastikan tidak ada respons yang dikirim
    expect(res._isEndCalled()).toBe(false);
  });
});
