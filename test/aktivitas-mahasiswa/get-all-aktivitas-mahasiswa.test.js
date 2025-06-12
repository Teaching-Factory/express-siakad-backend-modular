const httpMocks = require("node-mocks-http");
const { getAllAktivitasMahasiswa } = require("../../src/modules/aktivitas-mahasiswa/controller");
const { AktivitasMahasiswa, JenisAktivitasMahasiswa, Prodi, Semester } = require("../../models");

jest.mock("../../models");

describe("getAllAktivitasMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan semua data aktivitas mahasiswa
  it("should return all aktivitas mahasiswa with status 200 if found", async () => {
    const mockAktivitasMahasiswa = [
      { id: 1, jenisAktivitasMahasiswaId: 1, prodiId: 1, semesterId: 1, nama: "Aktivitas 1" },
      { id: 2, jenisAktivitasMahasiswaId: 2, prodiId: 1, semesterId: 1, nama: "Aktivitas 2" },
    ];

    AktivitasMahasiswa.findAll.mockResolvedValue(mockAktivitasMahasiswa);

    await getAllAktivitasMahasiswa(req, res);

    expect(AktivitasMahasiswa.findAll).toHaveBeenCalledWith({
      include: [{ model: JenisAktivitasMahasiswa }, { model: Prodi }, { model: Semester }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Aktivitas Mahasiswa Success",
      jumlahData: mockAktivitasMahasiswa.length,
      data: mockAktivitasMahasiswa,
    });
  });

  // Kode uji 2 - menangani kesalahan saat mengambil data dari database
  it("should handle errors", async () => {
    const errorMessage = "Database error";

    AktivitasMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllAktivitasMahasiswa(req, res, next);

    expect(AktivitasMahasiswa.findAll).toHaveBeenCalledWith({
      include: [{ model: JenisAktivitasMahasiswa }, { model: Prodi }, { model: Semester }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
