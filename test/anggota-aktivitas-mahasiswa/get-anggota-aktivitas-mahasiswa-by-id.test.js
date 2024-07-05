const httpMocks = require("node-mocks-http");
const { getAnggotaAktivitasMahasiswaById } = require("../../src/controllers/anggota-aktivitas-mahasiswa");
const { AnggotaAktivitasMahasiswa, AktivitasMahasiswa, Mahasiswa, Periode, Prodi } = require("../../models");

jest.mock("../../models");

describe("getAnggotaAktivitasMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji berhasil mendapatkan anggota aktivitas mahasiswa berdasarkan ID
  it("should get anggota aktivitas mahasiswa by ID with status 200 if found", async () => {
    const AnggotaAktivitasMahasiswaId = 1;
    const mockAnggotaAktivitasMahasiswa = {
      id: AnggotaAktivitasMahasiswaId,
      nama: "Anggota Test",
      aktivitasMahasiswa: { id: 1, nama: "Aktivitas Test" },
      mahasiswa: {
        id: 1,
        nama: "Mahasiswa Test",
        periode: { id: 1, nama: "Periode Test", prodi: { id: 1, nama: "Prodi Test" } },
      },
    };

    AnggotaAktivitasMahasiswa.findByPk.mockResolvedValue(mockAnggotaAktivitasMahasiswa);

    req.params.id = AnggotaAktivitasMahasiswaId;

    await getAnggotaAktivitasMahasiswaById(req, res, next);

    expect(AnggotaAktivitasMahasiswa.findByPk).toHaveBeenCalledWith(AnggotaAktivitasMahasiswaId, {
      include: [{ model: AktivitasMahasiswa }, { model: Mahasiswa, include: [{ model: Prodi }] }],
    });

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Anggota Aktivitas Mahasiswa By ID ${AnggotaAktivitasMahasiswaId} Success:`,
      data: mockAnggotaAktivitasMahasiswa,
    });
  });

  // Kode uji ketika anggota aktivitas mahasiswa tidak ditemukan
  it("should return 404 if anggota aktivitas mahasiswa ID not found", async () => {
    const AnggotaAktivitasMahasiswaId = 999;

    AnggotaAktivitasMahasiswa.findByPk.mockResolvedValue(null);

    req.params.id = AnggotaAktivitasMahasiswaId;

    await getAnggotaAktivitasMahasiswaById(req, res, next);

    expect(AnggotaAktivitasMahasiswa.findByPk).toHaveBeenCalledWith(AnggotaAktivitasMahasiswaId, {
      include: [{ model: AktivitasMahasiswa }, { model: Mahasiswa, include: [{ model: Prodi }] }],
    });

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Anggota Aktivitas Mahasiswa With ID ${AnggotaAktivitasMahasiswaId} Not Found:`,
    });
  });

  // Kode uji ketika ID tidak disediakan
  it("should return 400 if anggota aktivitas mahasiswa ID is not provided", async () => {
    req.params.id = undefined;

    await getAnggotaAktivitasMahasiswaById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Anggota Aktivitas Mahasiswa ID is required",
    });
  });

  // Kode uji untuk menangani kesalahan
  it("should handle errors", async () => {
    const AnggotaAktivitasMahasiswaId = 1;
    const errorMessage = "Database error";

    AnggotaAktivitasMahasiswa.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = AnggotaAktivitasMahasiswaId;

    await getAnggotaAktivitasMahasiswaById(req, res, next);

    expect(AnggotaAktivitasMahasiswa.findByPk).toHaveBeenCalledWith(AnggotaAktivitasMahasiswaId, {
      include: [{ model: AktivitasMahasiswa }, { model: Mahasiswa, include: [{ model: Prodi }] }],
    });

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
