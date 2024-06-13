const httpMocks = require("node-mocks-http");
const { getRekapJumlahMahasiswaById } = require("../../src/controllers/rekap-jumlah-mahasiswa");
const { RekapJumlahMahasiswa, Periode, Prodi } = require("../../models");

jest.mock("../../models");

describe("getRekapJumlahMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan rekap jumlah mahasiswa berdasarkan ID
  it("should return rekap jumlah mahasiswa by ID with status 200 if found", async () => {
    const rekapJumlahMahasiswaId = 1;
    const mockRekapJumlah = { id: rekapJumlahMahasiswaId, jumlah_mahasiswa: 100, periodeId: 1, prodiId: 1 };

    RekapJumlahMahasiswa.findByPk.mockResolvedValue(mockRekapJumlah);

    req.params.id = rekapJumlahMahasiswaId;

    await getRekapJumlahMahasiswaById(req, res, next);

    expect(RekapJumlahMahasiswa.findByPk).toHaveBeenCalledWith(rekapJumlahMahasiswaId, {
      include: [{ model: Periode }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Rekap Jumlah Mahasiswa By ID ${rekapJumlahMahasiswaId} Success:`,
      data: mockRekapJumlah,
    });
  });

  // Kode uji 2 - menangani kasus ketika rekap jumlah mahasiswa tidak ditemukan
  it("should handle rekap jumlah mahasiswa not found error", async () => {
    const rekapJumlahMahasiswaId = 999; // ID yang tidak ada di database

    RekapJumlahMahasiswa.findByPk.mockResolvedValue(null);

    req.params.id = rekapJumlahMahasiswaId;

    await getRekapJumlahMahasiswaById(req, res, next);

    expect(RekapJumlahMahasiswa.findByPk).toHaveBeenCalledWith(rekapJumlahMahasiswaId, {
      include: [{ model: Periode }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Rekap Jumlah Mahasiswa With ID ${rekapJumlahMahasiswaId} Not Found:`,
    });
  });

  // Kode uji 3 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should handle errors", async () => {
    const rekapJumlahMahasiswaId = 1;
    const errorMessage = "Database error";

    RekapJumlahMahasiswa.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = rekapJumlahMahasiswaId;

    await getRekapJumlahMahasiswaById(req, res, next);

    expect(RekapJumlahMahasiswa.findByPk).toHaveBeenCalledWith(rekapJumlahMahasiswaId, {
      include: [{ model: Periode }, { model: Prodi }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });

  // Kode uji 4 - menguji kasus ketika ID rekap jumlah mahasiswa tidak diberikan
  it("should return error response when rekap jumlah mahasiswa ID is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID rekap jumlah mahasiswa dalam parameter

    await getRekapJumlahMahasiswaById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Rekap Jumlah Mahasiswa ID is required",
    });
  });
});
