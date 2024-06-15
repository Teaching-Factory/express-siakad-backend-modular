const httpMocks = require("node-mocks-http");
const { getAllSubstansiKuliah } = require("../../src/controllers/substansi-kuliah");
const { SubstansiKuliah } = require("../../models");
const { Substansi } = require("../../models");

jest.mock("../../models");

describe("getAllSubstansiKuliah", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil semua substansi kuliah dengan status 200 jika berhasil
  it("should return all substansi kuliah with status 200", async () => {
    const mockSubstansiKuliah = [
      { id: 1, name: "Substansi Kuliah 1", Substansi: { id: 1, name: "Substansi 1" } },
      { id: 2, name: "Substansi Kuliah 2", Substansi: { id: 2, name: "Substansi 2" } },
    ];
    SubstansiKuliah.findAll.mockResolvedValue(mockSubstansiKuliah);

    await getAllSubstansiKuliah(req, res, next);

    expect(SubstansiKuliah.findAll).toHaveBeenCalledWith({ include: [{ model: Substansi }] });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Substansi Kuliah Success",
      jumlahData: mockSubstansiKuliah.length,
      data: mockSubstansiKuliah,
    });
  });

  // Kode uji 2 - Mengembalikan respons 200 dengan data kosong jika tidak ada substansi kuliah ditemukan
  it("should return 200 with empty data if no substansi kuliah found", async () => {
    SubstansiKuliah.findAll.mockResolvedValue([]);

    await getAllSubstansiKuliah(req, res, next);

    expect(SubstansiKuliah.findAll).toHaveBeenCalledWith({ include: [{ model: Substansi }] });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Substansi Kuliah Success",
      jumlahData: 0,
      data: [],
    });
  });

  // Kode uji 3 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    SubstansiKuliah.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllSubstansiKuliah(req, res, next);

    expect(SubstansiKuliah.findAll).toHaveBeenCalledWith({ include: [{ model: Substansi }] });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
