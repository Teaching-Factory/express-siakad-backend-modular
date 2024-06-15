const httpMocks = require("node-mocks-http");
const { getAllAktivitasKuliahMahasiswa } = require("../../src/controllers/aktivitas-kuliah-mahasiswa");
const { AktivitasKuliahMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getAllAktivitasKuliahMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan data aktivitas kuliah mahasiswa
  it("should return all aktivitas kuliah mahasiswa with status 200 if found", async () => {
    const mockAktivitas = [
      { id: 1, mahasiswaId: 1, semesterId: 1, prodiId: 1, statusMahasiswaId: 1 },
      { id: 2, mahasiswaId: 2, semesterId: 1, prodiId: 1, statusMahasiswaId: 2 },
    ];

    AktivitasKuliahMahasiswa.findAll.mockResolvedValue(mockAktivitas);

    await getAllAktivitasKuliahMahasiswa(req, res, next);

    expect(AktivitasKuliahMahasiswa.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Aktivitas Kuliah Mahasiswa Success",
      jumlahData: mockAktivitas.length,
      data: mockAktivitas,
    });
  });

  // Kode uji 2 - penanganan error saat gagal mendapatkan data
  it("should handle error if failed to fetch aktivitas kuliah mahasiswa", async () => {
    const errorMessage = "Database error";

    AktivitasKuliahMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllAktivitasKuliahMahasiswa(req, res, next);

    expect(AktivitasKuliahMahasiswa.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
