const httpMocks = require("node-mocks-http");
const { getAllJenisAktivitasMahasiswa } = require("../../src/controllers/jenis-aktivitas-mahasiswa");
const { JenisAktivitasMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getAllJenisAktivitasMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - berhasil mendapatkan semua jenis aktivitas mahasiswa
  it("should return all jenis aktivitas mahasiswa with status 200 if found", async () => {
    const mockJenisAktivitas = [
      { id: 1, nama: "Seminar" },
      { id: 2, nama: "Lomba" },
    ];

    JenisAktivitasMahasiswa.findAll.mockResolvedValue(mockJenisAktivitas);

    await getAllJenisAktivitasMahasiswa(req, res);

    expect(JenisAktivitasMahasiswa.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Jenis Aktivitas Mahasiswa Success",
      jumlahData: mockJenisAktivitas.length,
      data: mockJenisAktivitas,
    });
  });

  // Kode uji 2 - menangani kesalahan saat terjadi kesalahan database
  it("should handle errors", async () => {
    const errorMessage = "Database error";

    JenisAktivitasMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllJenisAktivitasMahasiswa(req, res, next);

    expect(JenisAktivitasMahasiswa.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
