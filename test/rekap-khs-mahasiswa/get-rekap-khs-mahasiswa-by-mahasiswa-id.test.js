const httpMocks = require("node-mocks-http");
const { getRekapKHSMahasiswaByMahasiswaId } = require("../../src/controllers/rekap-khs-mahasiswa");
const { RekapKHSMahasiswa, Mahasiswa, Prodi, Periode, MataKuliah } = require("../../models");

jest.mock("../../models");

describe("getRekapKHSMahasiswaByMahasiswaId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan data rekap KHS mahasiswa berdasarkan ID registrasi mahasiswa
  it("should return rekap KHS mahasiswa by ID registrasi mahasiswa with status 200 if found", async () => {
    const idRegistrasiMahasiswa = 1;
    const mockRekapKHS = [
      { id: 1, mahasiswaId: 1, prodiId: 1, periodeId: 1, mataKuliahId: 1 },
      { id: 2, mahasiswaId: 1, prodiId: 1, periodeId: 2, mataKuliahId: 2 },
    ];

    RekapKHSMahasiswa.findAll.mockResolvedValue(mockRekapKHS);

    req.params.id_registrasi_mahasiswa = idRegistrasiMahasiswa;

    await getRekapKHSMahasiswaByMahasiswaId(req, res, next);

    expect(RekapKHSMahasiswa.findAll).toHaveBeenCalledWith({
      where: { id_registrasi_mahasiswa: idRegistrasiMahasiswa },
      include: [{ model: Mahasiswa }, { model: Prodi }, { model: Periode }, { model: MataKuliah }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Rekap KHS Mahasiswa By ID ${idRegistrasiMahasiswa} Success:`,
      jumlahData: mockRekapKHS.length,
      data: mockRekapKHS,
    });
  });

  // Kode uji 2 - menangani kasus ketika data rekap KHS mahasiswa tidak ditemukan
  it("should handle not found error", async () => {
    const idRegistrasiMahasiswa = 999; // ID yang tidak ada dalam database

    RekapKHSMahasiswa.findAll.mockResolvedValue([]);

    req.params.id_registrasi_mahasiswa = idRegistrasiMahasiswa;

    await getRekapKHSMahasiswaByMahasiswaId(req, res, next);

    expect(RekapKHSMahasiswa.findAll).toHaveBeenCalledWith({
      where: { id_registrasi_mahasiswa: idRegistrasiMahasiswa },
      include: [{ model: Mahasiswa }, { model: Prodi }, { model: Periode }, { model: MataKuliah }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Rekap KHS Mahasiswa With ID ${idRegistrasiMahasiswa} Not Found:`,
    });
  });

  // Kode uji 3 - menangani kasus ketika ID registrasi mahasiswa tidak disediakan
  it("should return error response when ID Registrasi Mahasiswa is not provided", async () => {
    req.params.id_registrasi_mahasiswa = undefined; // Tidak ada ID registrasi mahasiswa dalam parameter

    await getRekapKHSMahasiswaByMahasiswaId(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "ID Registrasi Mahasiswa is required",
    });
  });

  // Kode uji 4 - menguji penanganan error saat terjadi kesalahan dalam database
  it("should handle errors", async () => {
    const idRegistrasiMahasiswa = 1;
    const errorMessage = "Database error";

    RekapKHSMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    req.params.id_registrasi_mahasiswa = idRegistrasiMahasiswa;

    await getRekapKHSMahasiswaByMahasiswaId(req, res, next);

    expect(RekapKHSMahasiswa.findAll).toHaveBeenCalledWith({
      where: { id_registrasi_mahasiswa: idRegistrasiMahasiswa },
      include: [{ model: Mahasiswa }, { model: Prodi }, { model: Periode }, { model: MataKuliah }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
