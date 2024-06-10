const httpMocks = require("node-mocks-http");
const { getAllSubstansi } = require("../../src/controllers/substansi");
const { Substansi, Prodi, JenisSubstansi } = require("../../models");

jest.mock("../../models");

describe("getAllSubstansi", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil semua data substansi dengan status 200 jika berhasil
  it("should return all substansi with status 200 if successful", async () => {
    const mockSubstansi = [
      { id: 1, name: "Substansi 1", Prodi: {}, JenisSubstansi: {} },
      { id: 2, name: "Substansi 2", Prodi: {}, JenisSubstansi: {} },
    ];
    Substansi.findAll.mockResolvedValue(mockSubstansi);

    await getAllSubstansi(req, res, next);

    expect(Substansi.findAll).toHaveBeenCalledWith({ include: [{ model: Prodi }, { model: JenisSubstansi }] });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Substansi Success",
      jumlahData: mockSubstansi.length,
      data: mockSubstansi,
    });
  });

  // Kode uji 2 - Mengembalikan respons 200 dengan data kosong jika tidak ada substansi yang ditemukan
  it("should return 200 with empty data if no substansi found", async () => {
    Substansi.findAll.mockResolvedValue([]);

    await getAllSubstansi(req, res, next);

    expect(Substansi.findAll).toHaveBeenCalledWith({ include: [{ model: Prodi }, { model: JenisSubstansi }] });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Substansi Success",
      jumlahData: 0,
      data: [],
    });
  });

  // Kode uji 3 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should return 500 if server error occurs", async () => {
    const errorMessage = "Server error";
    Substansi.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllSubstansi(req, res, next);

    expect(Substansi.findAll).toHaveBeenCalledWith({ include: [{ model: Prodi }, { model: JenisSubstansi }] });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });

  // Kode uji 4 - Mengembalikan respons 200 dengan jumlah data yang sesuai
  it("should return correct jumlahData", async () => {
    const mockSubstansi = [
      { id: 1, name: "Substansi 1", Prodi: {}, JenisSubstansi: {} },
      { id: 2, name: "Substansi 2", Prodi: {}, JenisSubstansi: {} },
      { id: 3, name: "Substansi 3", Prodi: {}, JenisSubstansi: {} },
    ];
    Substansi.findAll.mockResolvedValue(mockSubstansi);

    await getAllSubstansi(req, res, next);

    expect(Substansi.findAll).toHaveBeenCalledWith({ include: [{ model: Prodi }, { model: JenisSubstansi }] });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Substansi Success",
      jumlahData: mockSubstansi.length,
      data: mockSubstansi,
    });
  });
});
