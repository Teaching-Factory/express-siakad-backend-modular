const httpMocks = require("node-mocks-http");
const { getAllKelasKuliahByProdiId } = require("../../src/modules/kelas-kuliah/controller");
const { KelasKuliah, Prodi, Semester, MataKuliah, Dosen } = require("../../models");

jest.mock("../../models");

describe("getAllKelasKuliahByProdiId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan kelas_kuliah dengan ID prodi yang valid dan status 200 jika ditemukan
  it("should return all kelas_kuliah by prodi ID with status 200 if found", async () => {
    const prodiId = 1;
    const mockKelasKuliah = [
      { id: 1, nama: "Kelas Kuliah 1" },
      { id: 2, nama: "Kelas Kuliah 2" },
    ];
    KelasKuliah.findAll.mockResolvedValue(mockKelasKuliah);

    req.params.id_prodi = prodiId;

    await getAllKelasKuliahByProdiId(req, res, next);

    expect(KelasKuliah.findAll).toHaveBeenCalledWith({
      where: { id_prodi: prodiId },
      include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET All Kelas Kuliah By Prodi Id ${prodiId} Success`,
      jumlahData: mockKelasKuliah.length,
      data: mockKelasKuliah,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons 404 jika kelas_kuliah tidak ditemukan
  it("should return 404 if kelas_kuliah by prodi ID is not found", async () => {
    const prodiId = 1;
    KelasKuliah.findAll.mockResolvedValue([]);

    req.params.id_prodi = prodiId;

    await getAllKelasKuliahByProdiId(req, res, next);

    expect(KelasKuliah.findAll).toHaveBeenCalledWith({
      where: { id_prodi: prodiId },
      include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== No Kelas Kuliah Found for Prodi Id ${prodiId}`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - Mengembalikan respons 400 jika ID prodi tidak disediakan
  it("should return 400 if prodi ID is not provided", async () => {
    req.params.id_prodi = undefined;

    await getAllKelasKuliahByProdiId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 4 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    KelasKuliah.findAll.mockRejectedValue(new Error(errorMessage));

    const prodiId = 1;
    req.params.id_prodi = prodiId;

    await getAllKelasKuliahByProdiId(req, res, next);

    expect(KelasKuliah.findAll).toHaveBeenCalledWith({
      where: { id_prodi: prodiId },
      include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
