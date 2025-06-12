const httpMocks = require("node-mocks-http");
const { getAllAnggotaAktivitasMahasiswa } = require("../../src/modules/anggota-aktivitas-mahasiswa/controller");
const { AnggotaAktivitasMahasiswa } = require("../../models");

jest.mock("../../models");

describe("getAllAnggotaAktivitasMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji berhasil mengambil semua data anggota aktivitas mahasiswa
  it("should get all anggota aktivitas mahasiswa with status 200 if found", async () => {
    const mockAnggotaAktivitasMahasiswa = [
      { id: 1, nama: "Anggota 1" },
      { id: 2, nama: "Anggota 2" },
    ];

    AnggotaAktivitasMahasiswa.findAll.mockResolvedValue(mockAnggotaAktivitasMahasiswa);

    await getAllAnggotaAktivitasMahasiswa(req, res, next);

    expect(AnggotaAktivitasMahasiswa.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Anggota Aktivitas Mahasiswa Success",
      jumlahData: mockAnggotaAktivitasMahasiswa.length,
      data: mockAnggotaAktivitasMahasiswa,
    });
  });

  // Kode uji menangani kesalahan
  it("should handle errors", async () => {
    const errorMessage = "Database error";

    AnggotaAktivitasMahasiswa.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllAnggotaAktivitasMahasiswa(req, res, next);

    expect(AnggotaAktivitasMahasiswa.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
