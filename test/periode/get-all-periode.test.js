const httpMocks = require("node-mocks-http");
const { getAllPeriode } = require("../../src/controllers/periode");
const { Periode, Prodi } = require("../../models");

jest.mock("../../models");

describe("getAllPeriode", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil semua data periode
  it("should return all periode with status 200", async () => {
    const mockPeriode = [
      { id: 1, name: "Periode 1", Prodi: { id: 1, name: "Prodi 1" } },
      { id: 2, name: "Periode 2", Prodi: { id: 2, name: "Prodi 2" } },
    ];

    Periode.findAll.mockResolvedValue(mockPeriode);

    await getAllPeriode(req, res, next);

    expect(Periode.findAll).toHaveBeenCalledWith({ include: [{ model: Prodi }] });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Periode Success",
      jumlahData: mockPeriode.length,
      data: mockPeriode,
    });
  });

  // Kode uji 2 - Mengembalikan respons 200 dengan data kosong jika tidak ada periode
  it("should return 200 with empty data if no periode found", async () => {
    Periode.findAll.mockResolvedValue([]);

    await getAllPeriode(req, res, next);

    expect(Periode.findAll).toHaveBeenCalledWith({ include: [{ model: Prodi }] });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Periode Success",
      jumlahData: 0,
      data: [],
    });
  });

  // Kode uji 3 - Menangani kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    Periode.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllPeriode(req, res, next);

    expect(Periode.findAll).toHaveBeenCalledWith({ include: [{ model: Prodi }] });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
