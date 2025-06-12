const httpMocks = require("node-mocks-http");
const { deleteAktivitasMahasiswaById } = require("../../src/modules/aktivitas-mahasiswa/controller");
const { AktivitasMahasiswa } = require("../../models");

jest.mock("../../models");

describe("deleteAktivitasMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil menghapus aktivitas mahasiswa berdasarkan ID
  it("should delete aktivitas mahasiswa by ID with status 200 if found", async () => {
    const AktivitasMahasiswaId = 1;
    const mockAktivitasMahasiswa = {
      id: AktivitasMahasiswaId,
      nama: "Aktivitas Test",
      destroy: jest.fn(), // Menambahkan mock untuk destroy
    };

    // Mock function findByPk untuk mengembalikan data aktivitas mahasiswa
    AktivitasMahasiswa.findByPk.mockResolvedValue(mockAktivitasMahasiswa);

    // Set req.params.id
    req.params.id = AktivitasMahasiswaId;

    // Panggil fungsi deleteAktivitasMahasiswaById
    await deleteAktivitasMahasiswaById(req, res, next);

    // Memastikan findByPk dipanggil dengan benar
    expect(AktivitasMahasiswa.findByPk).toHaveBeenCalledWith(AktivitasMahasiswaId);

    // Memastikan destroy dipanggil pada objek aktivitas_mahasiswa
    expect(mockAktivitasMahasiswa.destroy).toHaveBeenCalled();

    // Memastikan respons status 200 dan pesan yang sesuai
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Aktivitas Mahasiswa With ID ${AktivitasMahasiswaId} Success:`,
    });
  });

  // Kode uji 2 - menangani kasus di mana aktivitas mahasiswa tidak ditemukan
  it("should return 404 if aktivitas mahasiswa with ID not found", async () => {
    const AktivitasMahasiswaId = 999; // ID yang tidak ada dalam database

    // Mock function findByPk untuk mengembalikan null
    AktivitasMahasiswa.findByPk.mockResolvedValue(null);

    // Set req.params.id
    req.params.id = AktivitasMahasiswaId;

    // Panggil fungsi deleteAktivitasMahasiswaById
    await deleteAktivitasMahasiswaById(req, res);

    // Memastikan findByPk dipanggil dengan benar
    expect(AktivitasMahasiswa.findByPk).toHaveBeenCalledWith(AktivitasMahasiswaId);

    // Memastikan respons status 404 dan pesan yang sesuai
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Aktivitas Mahasiswa With ID ${AktivitasMahasiswaId} Not Found:`,
    });
  });

  // Kode uji 3 - menangani kesalahan saat menghapus aktivitas mahasiswa
  it("should handle errors", async () => {
    const AktivitasMahasiswaId = 1;
    const errorMessage = "Database error";

    // Mock function findByPk untuk mengembalikan data aktivitas mahasiswa
    AktivitasMahasiswa.findByPk.mockResolvedValue({ id: AktivitasMahasiswaId });

    // Mock function destroy untuk menyebabkan error
    const mockDestroy = jest.fn().mockRejectedValue(new Error(errorMessage));
    AktivitasMahasiswa.findByPk.mockResolvedValue({ id: AktivitasMahasiswaId, destroy: mockDestroy });

    // Set req.params.id
    req.params.id = AktivitasMahasiswaId;

    // Panggil fungsi deleteAktivitasMahasiswaById
    await deleteAktivitasMahasiswaById(req, res, next);

    // Memastikan findByPk dipanggil dengan benar
    expect(AktivitasMahasiswa.findByPk).toHaveBeenCalledWith(AktivitasMahasiswaId);

    // Memastikan destroy dipanggil pada objek aktivitas_mahasiswa
    expect(mockDestroy).toHaveBeenCalled();

    // Memastikan next dipanggil dengan error yang sesuai
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });

  // Kode uji 4 - menangani kasus di mana Aktivitas Mahasiswa ID tidak diberikan
  it("should handle missing Aktivitas Mahasiswa ID", async () => {
    // Set req.params.id tidak ada
    req.params.id = undefined;

    // Panggil fungsi deleteAktivitasMahasiswaById
    await deleteAktivitasMahasiswaById(req, res, next);

    // Memastikan respons status 400 dan pesan yang sesuai
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Aktivitas Mahasiswa ID is required",
    });
  });
});
