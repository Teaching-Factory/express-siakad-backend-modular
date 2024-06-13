const httpMocks = require("node-mocks-http");
const { getRekapKRSMahasiswaById } = require("../../src/controllers/rekap-krs-mahasiswa");
const { RekapKRSMahasiswa, Prodi, Periode, Mahasiswa, MataKuliah, Semester } = require("../../models");

jest.mock("../../models");

describe("getRekapKRSMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan data rekap krs mahasiswa berdasarkan ID
  it("should return rekap krs mahasiswa by ID with status 200 if found", async () => {
    const RekapKRSMahasiswaId = 1;

    const mockRekapKRSMahasiswa = {
      id: RekapKRSMahasiswaId,
      prodiId: 1,
      periodeId: 1,
      mahasiswaId: 1,
      mataKuliahId: 1,
      semesterId: 1,
    };

    RekapKRSMahasiswa.findByPk.mockResolvedValue(mockRekapKRSMahasiswa);

    req.params.id = RekapKRSMahasiswaId;

    await getRekapKRSMahasiswaById(req, res, next);

    expect(RekapKRSMahasiswa.findByPk).toHaveBeenCalledWith(RekapKRSMahasiswaId, {
      include: [{ model: Prodi }, { model: Periode }, { model: Mahasiswa }, { model: MataKuliah }, { model: Semester }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Rekap KRS Mahasiswa By ID ${RekapKRSMahasiswaId} Success:`,
      data: mockRekapKRSMahasiswa,
    });
  });

  // Kode uji 2 - menangani kasus ketika tidak ada data rekap krs mahasiswa ditemukan
  it("should handle rekap krs mahasiswa not found with status 404", async () => {
    const RekapKRSMahasiswaId = 999; // ID yang tidak ada dalam mock data

    RekapKRSMahasiswa.findByPk.mockResolvedValue(null);

    req.params.id = RekapKRSMahasiswaId;

    await getRekapKRSMahasiswaById(req, res, next);

    expect(RekapKRSMahasiswa.findByPk).toHaveBeenCalledWith(RekapKRSMahasiswaId, {
      include: [{ model: Prodi }, { model: Periode }, { model: Mahasiswa }, { model: MataKuliah }, { model: Semester }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Rekap KRS Mahasiswa With ID ${RekapKRSMahasiswaId} Not Found:`,
    });
  });

  // Kode uji 3 - menangani kesalahan saat mengambil data dari database
  it("should handle errors", async () => {
    const RekapKRSMahasiswaId = 1;
    const errorMessage = "Database error";

    RekapKRSMahasiswa.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = RekapKRSMahasiswaId;

    await getRekapKRSMahasiswaById(req, res, next);

    expect(RekapKRSMahasiswa.findByPk).toHaveBeenCalledWith(RekapKRSMahasiswaId, {
      include: [{ model: Prodi }, { model: Periode }, { model: Mahasiswa }, { model: MataKuliah }, { model: Semester }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
