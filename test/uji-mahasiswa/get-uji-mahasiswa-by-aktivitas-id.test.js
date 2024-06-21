const httpMocks = require("node-mocks-http");
const { getUjiMahasiswaByAktivitasId } = require("../../src/controllers/uji-mahasiswa");
const { UjiMahasiswa, AktivitasMahasiswa, KategoriKegiatan, Dosen } = require("../../models");

jest.mock("../../models");

describe("getUjiMahasiswaByAktivitasId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get uji mahasiswa by aktivitas ID and return 200", async () => {
    const aktivitasId = 1;
    const mockUjiMahasiswaData = [
      {
        id: 1,
        id_aktivitas: aktivitasId,
        // Mock data lainnya sesuai kebutuhan
      },
      {
        id: 2,
        id_aktivitas: aktivitasId,
        // Mock data lainnya sesuai kebutuhan
      },
    ];

    req.params.id_aktivitas = aktivitasId;
    UjiMahasiswa.findAll.mockResolvedValue(mockUjiMahasiswaData);

    await getUjiMahasiswaByAktivitasId(req, res, next);

    expect(UjiMahasiswa.findAll).toHaveBeenCalledWith({
      where: { id_aktivitas: aktivitasId },
      include: [{ model: AktivitasMahasiswa }, { model: KategoriKegiatan }, { model: Dosen }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Uji Mahasiswa By Aktivitas ID ${aktivitasId} Success:`,
      jumlahData: mockUjiMahasiswaData.length,
      data: mockUjiMahasiswaData,
    });
  });

  it("should return 400 if aktivitas ID is not provided", async () => {
    req.params.id_aktivitas = undefined;

    await getUjiMahasiswaByAktivitasId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Aktivitas Mahasiswa ID is required",
    });
    expect(UjiMahasiswa.findAll).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const aktivitasId = 1;
    req.params.id_aktivitas = aktivitasId;

    UjiMahasiswa.findAll.mockRejectedValue(error);

    await getUjiMahasiswaByAktivitasId(req, res, next);

    expect(UjiMahasiswa.findAll).toHaveBeenCalledWith({
      where: { id_aktivitas: aktivitasId },
      include: [{ model: AktivitasMahasiswa }, { model: KategoriKegiatan }, { model: Dosen }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
