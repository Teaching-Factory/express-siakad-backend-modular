const httpMocks = require("node-mocks-http");
const { getAllFakultas } = require("../../src/controllers/fakultas");
const { Fakultas, JenjangPendidikan } = require("../../models");

jest.mock("../../models");

describe("getAllFakultas", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil semua fakultas dari database dan mengembalikan status 200 jika berhasil
  it("should return all fakultas with status 200 if found", async () => {
    const mockFakultas = [
      { id: 1, name: "Fakultas 1" },
      { id: 2, name: "Fakultas 2" },
    ];
    Fakultas.findAll.mockResolvedValue(mockFakultas);

    await getAllFakultas(req, res, next);

    expect(Fakultas.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Fakultas Success",
      jumlahData: mockFakultas.length,
      data: mockFakultas,
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Kode uji 2 - Mengembalikan respons 500 jika terjadi kesalahan di server
  it("should call next with error if there is an error on the server", async () => {
    const errorMessage = "Database error";
    Fakultas.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllFakultas(req, res, next);

    expect(Fakultas.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
