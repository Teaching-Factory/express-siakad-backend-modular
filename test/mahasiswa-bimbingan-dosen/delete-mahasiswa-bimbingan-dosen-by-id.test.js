const { deleteMahasiswaBimbinganDosenById } = require("../../src/controllers/mahasiswa-bimbingan-dosen");
const { MahasiswaBimbinganDosen } = require("../../models");

jest.mock("../../models"); // Mock models module

describe("deleteMahasiswaBimbinganDosenById", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: 1, // Contoh ID mahasiswa bimbingan dosen yang akan diuji
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete mahasiswa bimbingan dosen by ID and return 200", async () => {
    // Mock data yang diharapkan dari database
    const mockMahasiswaBimbinganDosen = {
      id: 1,
      destroy: jest.fn().mockResolvedValue(true), // Mock fungsi destroy untuk mengembalikan nilai yang diharapkan
    };

    // Mock findByPk untuk mengembalikan data yang diharapkan
    MahasiswaBimbinganDosen.findByPk.mockResolvedValue(mockMahasiswaBimbinganDosen);

    // Panggil fungsi controller
    await deleteMahasiswaBimbinganDosenById(req, res, next);

    // Pastikan status dan pesan dikembalikan sesuai harapan
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== DELETE Mahasiswa Bimbingan Dosen With ID ${req.params.id} Success:`,
    });

    // Pastikan fungsi destroy dipanggil dengan benar
    expect(mockMahasiswaBimbinganDosen.destroy).toHaveBeenCalled();
  });

  it("should return 404 if mahasiswa bimbingan dosen not found", async () => {
    // Mock findByPk untuk mengembalikan nilai null (data tidak ditemukan)
    MahasiswaBimbinganDosen.findByPk.mockResolvedValue(null);

    // Panggil fungsi controller
    await deleteMahasiswaBimbinganDosenById(req, res, next);

    // Pastikan respons status 404 dikembalikan
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== Mahasiswa Bimbingan Dosen With ID ${req.params.id} Not Found:`,
    });

    // Pastikan tidak ada pemanggilan destroy
    expect(MahasiswaBimbinganDosen.destroy).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const mockError = new Error("Database error");
    MahasiswaBimbinganDosen.findByPk.mockRejectedValue(mockError);

    // Panggil fungsi controller
    await deleteMahasiswaBimbinganDosenById(req, res, next);

    // Pastikan fungsi next dipanggil dengan error yang benar
    expect(next).toHaveBeenCalledWith(mockError);

    // Pastikan tidak ada pemanggilan res.status atau res.json
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
