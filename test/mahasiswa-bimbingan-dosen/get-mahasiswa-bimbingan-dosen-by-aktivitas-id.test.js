const { MahasiswaBimbinganDosen } = require("../../models");
const { getMahasiswaBimbinganDosenByAktivitasId } = require("../../src/controllers/mahasiswa-bimbingan-dosen");

jest.mock("../../models"); // Mock models module

describe("getMahasiswaBimbinganDosenByAktivitasId", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id_aktivitas: 1, // ID aktivitas yang akan diuji
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

  it("should return mahasiswa bimbingan dosen and return 200", async () => {
    // Mock data yang diharapkan dari database
    const mockMahasiswaBimbinganDosen = [
      {
        id: 1,
        id_aktivitas: 1,
        AktivitasMahasiswa: {
          /* ... */
        },
        KategoriKegiatan: {
          /* ... */
        },
        Dosen: {
          /* ... */
        },
      },
      // Tambahkan data lain jika diperlukan
    ];

    // Mock fungsi findAll untuk mengembalikan data yang diharapkan
    MahasiswaBimbinganDosen.findAll.mockResolvedValue(mockMahasiswaBimbinganDosen);

    // Panggil fungsi controller
    await getMahasiswaBimbinganDosenByAktivitasId(req, res, next);

    // Pastikan status dan data dikembalikan sesuai harapan
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== GET Mahasiswa Bimbingan Dosen By Aktivitas ID ${req.params.id_aktivitas} Success:`,
      jumlahData: mockMahasiswaBimbinganDosen.length,
      data: mockMahasiswaBimbinganDosen,
    });
  });

  it("should return 400 if aktivitas ID is not provided", async () => {
    req.params.id_aktivitas = undefined; // ID aktivitas tidak diberikan

    // Panggil fungsi controller
    await getMahasiswaBimbinganDosenByAktivitasId(req, res, next);

    // Pastikan respons status 400 dikembalikan
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Aktivitas Mahasiswa ID is required",
    });

    // Pastikan tidak ada pemanggilan findAll
    expect(MahasiswaBimbinganDosen.findAll).not.toHaveBeenCalled();
  });

  it("should return 404 if no data found for aktivitas ID", async () => {
    // Mock fungsi findAll untuk mengembalikan nilai null (tidak ada data ditemukan)
    MahasiswaBimbinganDosen.findAll.mockResolvedValue(null);

    // Panggil fungsi controller
    await getMahasiswaBimbinganDosenByAktivitasId(req, res, next);

    // Pastikan respons status 404 dikembalikan
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: `<===== Mahasiswa Bimbingan Dosen With ID ${req.params.id_aktivitas} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Database error");
    MahasiswaBimbinganDosen.findAll.mockRejectedValue(mockError);

    // Panggil fungsi controller
    await getMahasiswaBimbinganDosenByAktivitasId(req, res, next);

    // Pastikan fungsi next dipanggil dengan error yang benar
    expect(next).toHaveBeenCalledWith(mockError);

    // Pastikan tidak ada pemanggilan res.status atau res.json
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
