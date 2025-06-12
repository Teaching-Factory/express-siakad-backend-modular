const httpMocks = require("node-mocks-http");
const { deleteAnggotaAktivitasMahasiswaById } = require("../../src/modules/anggota-aktivitas-mahasiswa/controller");
const { AnggotaAktivitasMahasiswa } = require("../../models");

jest.mock("../../models");

describe("deleteAnggotaAktivitasMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil menghapus anggota aktivitas mahasiswa berdasarkan ID
  it("should delete anggota aktivitas mahasiswa by ID with status 200 if found", async () => {
    const AnggotaAktivitasMahasiswaId = 1;
    const mockAnggotaAktivitasMahasiswa = {
      id: AnggotaAktivitasMahasiswaId,
      destroy: jest.fn().mockResolvedValue(true),
    };

    // Mock function findByPk untuk mengembalikan data anggota aktivitas mahasiswa
    AnggotaAktivitasMahasiswa.findByPk.mockResolvedValue(mockAnggotaAktivitasMahasiswa);

    // Set req.params.id
    req.params.id = AnggotaAktivitasMahasiswaId;

    // Panggil fungsi deleteAnggotaAktivitasMahasiswaById
    await deleteAnggotaAktivitasMahasiswaById(req, res, next);

    // Memastikan findByPk dipanggil dengan benar
    expect(AnggotaAktivitasMahasiswa.findByPk).toHaveBeenCalledWith(AnggotaAktivitasMahasiswaId);

    // Memastikan destroy dipanggil pada objek anggota_aktivitas_mahasiswa
    expect(mockAnggotaAktivitasMahasiswa.destroy).toHaveBeenCalled();

    // Memastikan respons status 200 dan pesan yang sesuai
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Anggota Aktivitas Mahasiswa With ID ${AnggotaAktivitasMahasiswaId} Success:`,
    });
  });

  // Kode uji 2 - menangani kasus di mana anggota aktivitas mahasiswa tidak ditemukan
  it("should return 404 if anggota aktivitas mahasiswa with ID not found", async () => {
    const AnggotaAktivitasMahasiswaId = 999; // ID yang tidak ada dalam database

    // Mock function findByPk untuk mengembalikan null
    AnggotaAktivitasMahasiswa.findByPk.mockResolvedValue(null);

    // Set req.params.id
    req.params.id = AnggotaAktivitasMahasiswaId;

    // Panggil fungsi deleteAnggotaAktivitasMahasiswaById
    await deleteAnggotaAktivitasMahasiswaById(req, res);

    // Memastikan findByPk dipanggil dengan benar
    expect(AnggotaAktivitasMahasiswa.findByPk).toHaveBeenCalledWith(AnggotaAktivitasMahasiswaId);

    // Memastikan respons status 404 dan pesan yang sesuai
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Anggota Aktivitas Mahasiswa With ID ${AnggotaAktivitasMahasiswaId} Not Found:`,
    });
  });

  // Kode uji 3 - menangani kesalahan saat menghapus anggota aktivitas mahasiswa
  it("should handle errors", async () => {
    const AnggotaAktivitasMahasiswaId = 1;
    const errorMessage = "Database error";

    // Mock function findByPk untuk mengembalikan data anggota aktivitas mahasiswa
    AnggotaAktivitasMahasiswa.findByPk.mockResolvedValue({ id: AnggotaAktivitasMahasiswaId });

    // Mock function destroy untuk menyebabkan error
    const mockDestroy = jest.fn().mockRejectedValue(new Error(errorMessage));
    AnggotaAktivitasMahasiswa.findByPk.mockResolvedValue({ id: AnggotaAktivitasMahasiswaId, destroy: mockDestroy });

    // Set req.params.id
    req.params.id = AnggotaAktivitasMahasiswaId;

    // Panggil fungsi deleteAnggotaAktivitasMahasiswaById
    await deleteAnggotaAktivitasMahasiswaById(req, res, next);

    // Memastikan findByPk dipanggil dengan benar
    expect(AnggotaAktivitasMahasiswa.findByPk).toHaveBeenCalledWith(AnggotaAktivitasMahasiswaId);

    // Memastikan destroy dipanggil pada objek anggota_aktivitas_mahasiswa
    expect(mockDestroy).toHaveBeenCalled();

    // Memastikan next dipanggil dengan error yang sesuai
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });

  // Kode uji 4 - menangani kasus di mana Anggota Aktivitas Mahasiswa ID tidak diberikan
  it("should handle missing Anggota Aktivitas Mahasiswa ID", async () => {
    // Set req.params.id tidak ada
    req.params.id = undefined;

    // Panggil fungsi deleteAnggotaAktivitasMahasiswaById
    await deleteAnggotaAktivitasMahasiswaById(req, res, next);

    // Memastikan respons status 400 dan pesan yang sesuai
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Anggota Aktvitas Mahasiswa ID is required",
    });
  });
});
