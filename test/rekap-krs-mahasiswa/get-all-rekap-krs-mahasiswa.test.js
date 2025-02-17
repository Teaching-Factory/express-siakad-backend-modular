const httpMocks = require("node-mocks-http");
const { getAllRekapKRSMahasiswa } = require("../../src/controllers/rekap-krs-mahasiswa");
const { RekapKRSMahasiswa, Prodi, Mahasiswa, MataKuliah, Semester } = require("../../models");

jest.mock("../../models");

describe("getAllRekapKRSMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan semua data rekap krs mahasiswa
  it("should return all rekap krs mahasiswa with status 200 if found", async () => {
    const mockRekapKRSMahasiswa = [
      {
        id: 1,
        prodiId: 1,
        periodeId: 1,
        mahasiswaId: 1,
        mataKuliahId: 1,
        semesterId: 1,
      },
      {
        id: 2,
        prodiId: 2,
        periodeId: 1,
        mahasiswaId: 2,
        mataKuliahId: 2,
        semesterId: 1,
      },
    ];

    RekapKRSMahasiswa.findAll.mockResolvedValue(mockRekapKRSMahasiswa);

    await getAllRekapKRSMahasiswa(req, res, next);

    expect(RekapKRSMahasiswa.findAll).toHaveBeenCalledWith({
      include: [{ model: Prodi }, { model: Mahasiswa }, { model: MataKuliah }, { model: Semester }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Rekap KRS Mahasiswa Success",
      jumlahData: mockRekapKRSMahasiswa.length,
      data: mockRekapKRSMahasiswa,
    });
  });

  // Kode uji 2 - menguji penanganan error saat terjadi kesalahan dalam database
  it("should handle errors", async () => {
    const errorMessage = "Database error";

    RekapKRSMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllRekapKRSMahasiswa(req, res, next);

    expect(RekapKRSMahasiswa.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
