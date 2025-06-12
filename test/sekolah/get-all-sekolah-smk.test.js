const { getAllSekolahSMK } = require("../../src/modules/sekolah/controller"); 
const { Sekolah } = require("../../models"); 
const httpMocks = require("node-mocks-http");

describe("getAllSekolahSMK", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Membersihkan mock setelah setiap pengujian
  });

  it("should return 200 and all SMK schools", async () => {
    // Mock data sekolah SMK yang dikembalikan oleh database
    const mockSekolahSMK = [
      { id: 1, sekolah: "SMK 1" },
      { id: 2, sekolah: "SMK 2" }
    ];

    // Mock metode findAll dari Sekolah untuk mengembalikan data SMK
    Sekolah.findAll = jest.fn().mockResolvedValue(mockSekolahSMK);

    // Panggil fungsi getAllSekolahSMK
    await getAllSekolahSMK(req, res, next);

    // Periksa apakah status 200 dikembalikan
    expect(res.statusCode).toBe(200);

    // Periksa apakah pesan yang dikembalikan benar
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Sekolah SMK Success",
      jumlahData: mockSekolahSMK.length,
      data: mockSekolahSMK
    });

    // Pastikan metode findAll dipanggil dengan benar
    expect(Sekolah.findAll).toHaveBeenCalledWith({
      where: { bentuk: "SMK" },
      attributes: ["id", "sekolah"]
    });
  });

  it("should return 200 and empty data if no SMK schools are found", async () => {
    // Mock findAll mengembalikan array kosong
    Sekolah.findAll = jest.fn().mockResolvedValue([]);

    // Panggil fungsi getAllSekolahSMK
    await getAllSekolahSMK(req, res, next);

    // Periksa apakah status 200 dikembalikan
    expect(res.statusCode).toBe(200);

    // Periksa respons JSON jika data kosong
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Sekolah SMK Success",
      jumlahData: 0,
      data: []
    });

    // Pastikan metode findAll dipanggil dengan benar
    expect(Sekolah.findAll).toHaveBeenCalledWith({
      where: { bentuk: "SMK" },
      attributes: ["id", "sekolah"]
    });
  });

  it("should handle errors and call next with error", async () => {
    // Mock error saat mengakses database
    const mockError = new Error("Database error");
    Sekolah.findAll = jest.fn().mockRejectedValue(mockError);

    // Panggil fungsi getAllSekolahSMK
    await getAllSekolahSMK(req, res, next);

    // Periksa apakah fungsi next dipanggil dengan error
    expect(next).toHaveBeenCalledWith(mockError);

    // Pastikan tidak ada respons yang dikirim
    expect(res._isEndCalled()).toBe(false);
  });
});
