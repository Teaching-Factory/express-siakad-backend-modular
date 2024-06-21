const httpMocks = require("node-mocks-http");
const { getKRSMahasiswaById } = require("../../src/controllers/krs-mahasiswa");
const { KRSMahasiswa, Mahasiswa, Periode, Prodi, MataKuliah, KelasKuliah } = require("../../models");

jest.mock("../../models");

describe("getKRSMahasiswaById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan KRS mahasiswa dengan ID yang valid dan status 200 jika ditemukan
  it("should return KRS mahasiswa by ID with status 200 if found", async () => {
    const KRSMahasiswaId = 1;
    const mockKRSMahasiswa = { id: KRSMahasiswaId, nama: "KRS Mahasiswa 1" };
    KRSMahasiswa.findByPk.mockResolvedValue(mockKRSMahasiswa);

    req.params.id = KRSMahasiswaId;

    await getKRSMahasiswaById(req, res, next);

    expect(KRSMahasiswa.findByPk).toHaveBeenCalledWith(KRSMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: Periode }, { model: Prodi }, { model: MataKuliah }, { model: KelasKuliah }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET KRS Mahasiswa By ID ${KRSMahasiswaId} Success:`,
      data: mockKRSMahasiswa,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons 404 jika KRS mahasiswa tidak ditemukan
  it("should return 404 if KRS mahasiswa by ID is not found", async () => {
    const KRSMahasiswaId = 1;
    KRSMahasiswa.findByPk.mockResolvedValue(null);

    req.params.id = KRSMahasiswaId;

    await getKRSMahasiswaById(req, res, next);

    expect(KRSMahasiswa.findByPk).toHaveBeenCalledWith(KRSMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: Periode }, { model: Prodi }, { model: MataKuliah }, { model: KelasKuliah }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== KRS Mahasiswa With ID ${KRSMahasiswaId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - Mengembalikan respons 400 jika ID KRS mahasiswa tidak disediakan
  it("should return 400 if KRS mahasiswa ID is not provided", async () => {
    req.params.id = undefined;

    await getKRSMahasiswaById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "KRS Mahasiswa ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 4 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    KRSMahasiswa.findByPk.mockRejectedValue(new Error(errorMessage));

    const KRSMahasiswaId = 1;
    req.params.id = KRSMahasiswaId;

    await getKRSMahasiswaById(req, res, next);

    expect(KRSMahasiswa.findByPk).toHaveBeenCalledWith(KRSMahasiswaId, {
      include: [{ model: Mahasiswa }, { model: Periode }, { model: Prodi }, { model: MataKuliah }, { model: KelasKuliah }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
