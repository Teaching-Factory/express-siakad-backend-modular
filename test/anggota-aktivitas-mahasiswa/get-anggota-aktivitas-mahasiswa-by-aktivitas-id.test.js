const httpMocks = require("node-mocks-http");
const { getAnggotaAktivitasMahasiswaByAktivitasId } = require("../../src/modules/anggota-aktivitas-mahasiswa/controller");
const { AnggotaAktivitasMahasiswa, AktivitasMahasiswa, Mahasiswa, Periode, Prodi } = require("../../models");

jest.mock("../../models");

describe("getAnggotaAktivitasMahasiswaByAktivitasId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji berhasil mendapatkan anggota aktivitas mahasiswa berdasarkan ID aktivitas
  it("should get anggota aktivitas mahasiswa by aktivitas ID with status 200 if found", async () => {
    const AktivitasId = 1;
    const mockAnggotaAktivitasMahasiswa = [
      {
        id: 1,
        nama: "Anggota Test 1",
        aktivitasMahasiswa: { id: AktivitasId, nama: "Aktivitas Test" },
        mahasiswa: {
          id: 1,
          nama: "Mahasiswa Test 1",
          periode: { id: 1, nama: "Periode Test 1", prodi: { id: 1, nama: "Prodi Test 1" } },
        },
      },
      {
        id: 2,
        nama: "Anggota Test 2",
        aktivitasMahasiswa: { id: AktivitasId, nama: "Aktivitas Test" },
        mahasiswa: {
          id: 2,
          nama: "Mahasiswa Test 2",
          periode: { id: 2, nama: "Periode Test 2", prodi: { id: 2, nama: "Prodi Test 2" } },
        },
      },
    ];

    AnggotaAktivitasMahasiswa.findAll.mockResolvedValue(mockAnggotaAktivitasMahasiswa);

    req.params.id_aktivitas = AktivitasId;

    await getAnggotaAktivitasMahasiswaByAktivitasId(req, res, next);

    expect(AnggotaAktivitasMahasiswa.findAll).toHaveBeenCalledWith({
      where: { id_aktivitas: AktivitasId },
      include: [{ model: AktivitasMahasiswa }, { model: Mahasiswa, include: [{ model: Prodi }] }],
    });

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Anggota Aktivitas Mahasiswa By Aktivitas ID ${AktivitasId} Success:`,
      jumlahData: mockAnggotaAktivitasMahasiswa.length,
      data: mockAnggotaAktivitasMahasiswa,
    });
  });

  // Kode uji ketika data tidak ditemukan
  it("should return 404 if no anggota aktivitas mahasiswa found for aktivitas ID", async () => {
    const AktivitasId = 999;

    AnggotaAktivitasMahasiswa.findAll.mockResolvedValue([]);

    req.params.id_aktivitas = AktivitasId;

    await getAnggotaAktivitasMahasiswaByAktivitasId(req, res, next);

    expect(AnggotaAktivitasMahasiswa.findAll).toHaveBeenCalledWith({
      where: { id_aktivitas: AktivitasId },
      include: [{ model: AktivitasMahasiswa }, { model: Mahasiswa, include: [{ model: Prodi }] }],
    });

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Anggota Aktivitas Mahasiswa With ID ${AktivitasId} Not Found:`,
    });
  });

  // Kode uji untuk menangani kesalahan
  it("should handle errors", async () => {
    const AktivitasId = 1;
    const errorMessage = "Database error";

    AnggotaAktivitasMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    req.params.id_aktivitas = AktivitasId;

    await getAnggotaAktivitasMahasiswaByAktivitasId(req, res, next);

    expect(AnggotaAktivitasMahasiswa.findAll).toHaveBeenCalledWith({
      where: { id_aktivitas: AktivitasId },
      include: [{ model: AktivitasMahasiswa }, { model: Mahasiswa, include: [{ model: Prodi }] }],
    });

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });

  // Kode uji ketika ID aktivitas tidak disediakan
  it("should return 400 if aktivitas ID is not provided", async () => {
    req.params.id_aktivitas = undefined;

    await getAnggotaAktivitasMahasiswaByAktivitasId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Aktivitas ID is required",
    });
  });
});
