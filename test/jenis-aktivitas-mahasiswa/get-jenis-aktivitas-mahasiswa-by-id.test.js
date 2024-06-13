const httpMocks = require("node-mocks-http");
const { getJenisAktivitasMahasiswaById } = require("../../src/controllers/jenis-aktivitas-mahasiswa");
const { JenisAktivitasMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getJenisAktivitasMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan jenis aktivitas mahasiswa berdasarkan ID yang sesuai
  it("should return jenis aktivitas mahasiswa with status 200 if found", async () => {
    const jenisAktivitasId = 1;
    const mockJenisAktivitas = { id: jenisAktivitasId, nama: "Seminar" };

    JenisAktivitasMahasiswa.findByPk.mockResolvedValue(mockJenisAktivitas);

    req.params.id = jenisAktivitasId;

    await getJenisAktivitasMahasiswaById(req, res, next);

    expect(JenisAktivitasMahasiswa.findByPk).toHaveBeenCalledWith(jenisAktivitasId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Jenis Aktivitas Mahasiswa By ID ${jenisAktivitasId} Success:`,
      data: mockJenisAktivitas,
    });
  });

  // Kode uji 2 - menangani kasus ketika jenis aktivitas mahasiswa tidak ditemukan
  it("should handle not found error", async () => {
    const jenisAktivitasId = 999; // ID yang tidak ada dalam database

    JenisAktivitasMahasiswa.findByPk.mockResolvedValue(null);

    req.params.id = jenisAktivitasId;

    await getJenisAktivitasMahasiswaById(req, res, next);

    expect(JenisAktivitasMahasiswa.findByPk).toHaveBeenCalledWith(jenisAktivitasId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Jenis Aktivitas Mahasiswa With ID ${jenisAktivitasId} Not Found:`,
    });
  });

  // Kode uji 3 - menangani kasus ketika ID jenis aktivitas mahasiswa tidak diberikan
  it("should return error response when jenis aktivitas mahasiswa ID is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID jenis aktivitas mahasiswa dalam parameter

    await getJenisAktivitasMahasiswaById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Jenis Aktivitas Mahasiswa ID is required",
    });
  });

  // Kode uji 4 - menangani kesalahan saat terjadi kesalahan database
  it("should handle errors", async () => {
    const jenisAktivitasId = 1;
    const errorMessage = "Database error";

    JenisAktivitasMahasiswa.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = jenisAktivitasId;

    await getJenisAktivitasMahasiswaById(req, res, next);

    expect(JenisAktivitasMahasiswa.findByPk).toHaveBeenCalledWith(jenisAktivitasId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
