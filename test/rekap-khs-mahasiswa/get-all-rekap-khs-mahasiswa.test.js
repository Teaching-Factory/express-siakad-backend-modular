const httpMocks = require("node-mocks-http");
const { getAllRekapKHSMahasiswa } = require("../../src/controllers/rekap-khs-mahasiswa");
const { RekapKHSMahasiswa, Mahasiswa, Prodi, MataKuliah, Semester } = require("../../models");

jest.mock("../../models");

describe("getAllRekapKHSMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan semua data rekap KHS mahasiswa
  it("should return all rekap KHS mahasiswa with status 200 if found", async () => {
    const mockRekapKHS = [
      { id: 1, mahasiswaId: 1, prodiId: 1, id_semester: "20241", mataKuliahId: 1 },
      { id: 2, mahasiswaId: 2, prodiId: 1, id_semester: "20241", mataKuliahId: 2 },
    ];

    RekapKHSMahasiswa.findAll.mockResolvedValue(mockRekapKHS);

    await getAllRekapKHSMahasiswa(req, res, next);

    expect(RekapKHSMahasiswa.findAll).toHaveBeenCalledWith({
      include: [{ model: Mahasiswa }, { model: Prodi }, { model: MataKuliah }, { model: Semester }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Rekap KHS Mahasiswa Success",
      jumlahData: mockRekapKHS.length,
      data: mockRekapKHS,
    });
  });

  // Kode uji 2 - menangani kasus ketika tidak ada data rekap KHS mahasiswa
  it("should handle empty rekap KHS mahasiswa", async () => {
    RekapKHSMahasiswa.findAll.mockResolvedValue([]);

    await getAllRekapKHSMahasiswa(req, res, next);

    expect(RekapKHSMahasiswa.findAll).toHaveBeenCalledWith({
      include: [{ model: Mahasiswa }, { model: Prodi }, { model: MataKuliah }, { model: Semester }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Rekap KHS Mahasiswa Success",
      jumlahData: 0,
      data: [],
    });
  });

  // Kode uji 3 - menguji penanganan error saat terjadi kesalahan database
  it("should handle errors", async () => {
    const errorMessage = "Database error";

    RekapKHSMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllRekapKHSMahasiswa(req, res, next);

    expect(RekapKHSMahasiswa.findAll).toHaveBeenCalledWith({
      include: [{ model: Mahasiswa }, { model: Prodi }, { model: MataKuliah }, { model: Semester }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
