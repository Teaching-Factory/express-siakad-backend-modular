const httpMocks = require("node-mocks-http");
const { getKelasKuliahById } = require("../../src/modules/kelas-kuliah/controller");
const { KelasKuliah, Prodi, Semester, MataKuliah, Dosen } = require("../../models");

jest.mock("../../models");

describe("getKelasKuliahById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan data kelas kuliah jika ID tersedia
  it("should return kelas kuliah if ID is provided", async () => {
    const kelasKuliahId = "00005ee8-595e-4cca-842c-5939ce087230";

    const mockKelasKuliah = {
      id: kelasKuliahId,
      nama: "Kelas Kuliah 1",
      prodi: { id: 1, nama: "Prodi 1" },
      semester: { id: 1, nama: "Semester 1" },
      mataKuliah: { id: 1, nama: "Mata Kuliah 1" },
      dosen: { id: 1, nama: "Dosen 1" },
    };
    KelasKuliah.findByPk.mockResolvedValue(mockKelasKuliah);

    req.params.id = kelasKuliahId;

    await getKelasKuliahById(req, res, next);

    expect(KelasKuliah.findByPk).toHaveBeenCalledWith(kelasKuliahId, {
      include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Kelas Kuliah By ID ${kelasKuliahId} Success:`,
      data: mockKelasKuliah,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons error jika ID tidak tersedia
  it("should return an error response if ID is not provided", async () => {
    await getKelasKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Kelas Kuliah ID is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 3 - Mengembalikan respons error jika kelas kuliah tidak ditemukan
  it("should return an error response if kelas kuliah is not found", async () => {
    const kelasKuliahId = "A121";
    KelasKuliah.findByPk.mockResolvedValue(null);

    req.params.id = kelasKuliahId;

    await getKelasKuliahById(req, res, next);

    expect(KelasKuliah.findByPk).toHaveBeenCalledWith(kelasKuliahId, {
      include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Kelas Kuliah With ID ${kelasKuliahId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 4 - Mengembalikan respons error jika terjadi kesalahan
  it("should call next with error if there is an error", async () => {
    const kelasKuliahId = 1;
    const errorMessage = "Database error";
    KelasKuliah.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = kelasKuliahId;

    await getKelasKuliahById(req, res, next);

    expect(KelasKuliah.findByPk).toHaveBeenCalledWith(kelasKuliahId, {
      include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
