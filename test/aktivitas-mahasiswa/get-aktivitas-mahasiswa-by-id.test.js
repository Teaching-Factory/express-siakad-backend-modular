const httpMocks = require("node-mocks-http");
const { getAktivitasMahasiswaById } = require("../../src/modules/aktivitas-mahasiswa/controller");
const { AktivitasMahasiswa, JenisAktivitasMahasiswa, Prodi, Semester } = require("../../models");

jest.mock("../../models");

describe("getAktivitasMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan aktivitas mahasiswa berdasarkan ID
  it("should return aktivitas mahasiswa by ID with status 200 if found", async () => {
    const AktivitasMahasiswaId = 1;
    const mockAktivitasMahasiswa = {
      id: AktivitasMahasiswaId,
      jenisAktivitasMahasiswaId: 1,
      prodiId: 1,
      semesterId: 1,
      nama: "Aktivitas Test",
    };

    AktivitasMahasiswa.findByPk.mockResolvedValue(mockAktivitasMahasiswa);

    req.params.id = AktivitasMahasiswaId;

    await getAktivitasMahasiswaById(req, res);

    expect(AktivitasMahasiswa.findByPk).toHaveBeenCalledWith(AktivitasMahasiswaId, {
      include: [{ model: JenisAktivitasMahasiswa }, { model: Prodi }, { model: Semester }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Aktivitas Mahasiswa By ID ${AktivitasMahasiswaId} Success:`,
      data: mockAktivitasMahasiswa,
    });
  });

  // Kode uji 2 - menangani kasus di mana aktivitas mahasiswa tidak ditemukan
  it("should return 404 if aktivitas mahasiswa with ID not found", async () => {
    const AktivitasMahasiswaId = 999; // ID yang tidak ada dalam database
    AktivitasMahasiswa.findByPk.mockResolvedValue(null);

    req.params.id = AktivitasMahasiswaId;

    await getAktivitasMahasiswaById(req, res);

    expect(AktivitasMahasiswa.findByPk).toHaveBeenCalledWith(AktivitasMahasiswaId, {
      include: [{ model: JenisAktivitasMahasiswa }, { model: Prodi }, { model: Semester }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Aktivitas Mahasiswa With ID ${AktivitasMahasiswaId} Not Found:`,
    });
  });

  // Kode uji 3 - menangani kesalahan saat mengambil data dari database
  it("should handle errors", async () => {
    const AktivitasMahasiswaId = 1;
    const errorMessage = "Database error";

    AktivitasMahasiswa.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = AktivitasMahasiswaId;

    await getAktivitasMahasiswaById(req, res, next);

    expect(AktivitasMahasiswa.findByPk).toHaveBeenCalledWith(AktivitasMahasiswaId, {
      include: [{ model: JenisAktivitasMahasiswa }, { model: Prodi }, { model: Semester }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
