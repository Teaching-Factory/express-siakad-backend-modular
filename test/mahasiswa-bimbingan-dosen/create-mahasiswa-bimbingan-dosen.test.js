const { createMahasiswaBimbinganDosen } = require("../../src/controllers/mahasiswa-bimbingan-dosen");
const { MahasiswaBimbinganDosen } = require("../../models");

jest.mock("../../models"); // Mock models module

describe("createMahasiswaBimbinganDosen", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        pembimbing_ke: "Pembimbing 1",
        id_kategori_kegiatan: 1,
        id_dosen: 1,
      },
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

  it("should create mahasiswa bimbingan dosen and return 201", async () => {
    // Mock data yang diharapkan dari database
    const mockNewMahasiswaBimbinganDosen = {
      id: 1,
      pembimbing_ke: req.body.pembimbing_ke,
      id_aktivitas: req.params.id_aktivitas,
      id_kategori_kegiatan: req.body.id_kategori_kegiatan,
      id_dosen: req.body.id_dosen,
    };

    // Mock fungsi create untuk mengembalikan data yang diharapkan
    MahasiswaBimbinganDosen.create.mockResolvedValue(mockNewMahasiswaBimbinganDosen);

    // Panggil fungsi controller
    await createMahasiswaBimbinganDosen(req, res, next);

    // Pastikan status dan data dikembalikan sesuai harapan
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "<===== CREATE Mahasiswa Bimbingan Dosen Success",
      data: mockNewMahasiswaBimbinganDosen,
    });
  });

  it("should return 400 if pembimbing_ke is not provided", async () => {
    req.body.pembimbing_ke = undefined; // Nilai pembimbing_ke tidak diberikan

    // Panggil fungsi controller
    await createMahasiswaBimbinganDosen(req, res, next);

    // Pastikan respons status 400 dikembalikan
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "pembimbing_ke is required",
    });

    // Pastikan tidak ada pemanggilan MahasiswaBimbinganDosen.create
    expect(MahasiswaBimbinganDosen.create).not.toHaveBeenCalled();
  });

  it("should return 400 if id_kategori_kegiatan is not provided", async () => {
    req.body.id_kategori_kegiatan = undefined; // Nilai id_kategori_kegiatan tidak diberikan

    // Panggil fungsi controller
    await createMahasiswaBimbinganDosen(req, res, next);

    // Pastikan respons status 400 dikembalikan
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "id_kategori_kegiatan is required",
    });

    // Pastikan tidak ada pemanggilan MahasiswaBimbinganDosen.create
    expect(MahasiswaBimbinganDosen.create).not.toHaveBeenCalled();
  });

  it("should return 400 if id_dosen is not provided", async () => {
    req.body.id_dosen = undefined; // Nilai id_dosen tidak diberikan

    // Panggil fungsi controller
    await createMahasiswaBimbinganDosen(req, res, next);

    // Pastikan respons status 400 dikembalikan
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "id_dosen is required",
    });

    // Pastikan tidak ada pemanggilan MahasiswaBimbinganDosen.create
    expect(MahasiswaBimbinganDosen.create).not.toHaveBeenCalled();
  });

  it("should return 400 if aktivitas ID is not provided", async () => {
    req.params.id_aktivitas = undefined; // ID aktivitas tidak diberikan

    // Panggil fungsi controller
    await createMahasiswaBimbinganDosen(req, res, next);

    // Pastikan respons status 400 dikembalikan
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Aktivitas Mahasiswa ID is required",
    });

    // Pastikan tidak ada pemanggilan MahasiswaBimbinganDosen.create
    expect(MahasiswaBimbinganDosen.create).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const mockError = new Error("Database error");
    MahasiswaBimbinganDosen.create.mockRejectedValue(mockError);

    // Panggil fungsi controller
    await createMahasiswaBimbinganDosen(req, res, next);

    // Pastikan fungsi next dipanggil dengan error yang benar
    expect(next).toHaveBeenCalledWith(mockError);

    // Pastikan tidak ada pemanggilan res.status atau res.json
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
