const httpMocks = require("node-mocks-http");
const { getAllKelasKuliah } = require("../../src/controllers/kelas-kuliah");
const { KelasKuliah, Prodi, Semester, MataKuliah, Dosen } = require("../../models");

jest.mock("../../models");

describe("getAllKelasKuliah", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengembalikan semua data kelas kuliah jika berhasil
  it("should return all kelas kuliah if successful", async () => {
    const mockKelasKuliah = [
      { id: 1, nama: "Kelas Kuliah 1", prodi: { id: 1, nama: "Prodi 1" }, semester: { id: 1, nama: "Semester 1" }, mataKuliah: { id: 1, nama: "Mata Kuliah 1" }, dosen: { id: 1, nama: "Dosen 1" } },
      { id: 2, nama: "Kelas Kuliah 2", prodi: { id: 1, nama: "Prodi 1" }, semester: { id: 2, nama: "Semester 2" }, mataKuliah: { id: 2, nama: "Mata Kuliah 2" }, dosen: { id: 2, nama: "Dosen 2" } },
    ];
    KelasKuliah.findAll.mockResolvedValue(mockKelasKuliah);

    await getAllKelasKuliah(req, res, next);

    expect(KelasKuliah.findAll).toHaveBeenCalledWith({ include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }] });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Kelas Kuliah Success",
      jumlahData: mockKelasKuliah.length,
      data: mockKelasKuliah,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons error jika terjadi kesalahan
  it("should call next with error if there is an error", async () => {
    const errorMessage = "Database error";
    KelasKuliah.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllKelasKuliah(req, res, next);

    expect(KelasKuliah.findAll).toHaveBeenCalledWith({ include: [{ model: Prodi }, { model: Semester }, { model: MataKuliah }, { model: Dosen }] });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
