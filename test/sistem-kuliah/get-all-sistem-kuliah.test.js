const httpMocks = require("node-mocks-http");
const { getAllSistemKuliah } = require("../../src/modules/sistem-kuliah/controller");
const { SistemKuliah } = require("../../models");

jest.mock("../../models");

describe("getAllSistemKuliah", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get all sistem kuliah and return 200 if data is found", async () => {
    const mockSistemKuliah = [
      { id: 1, nama: "Sistem Kuliah A" },
      { id: 2, nama: "Sistem Kuliah B" },
    ];

    SistemKuliah.findAll.mockResolvedValue(mockSistemKuliah);

    await getAllSistemKuliah(req, res, next);

    expect(SistemKuliah.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Sistem Kuliah Success",
      jumlahData: mockSistemKuliah.length,
      data: mockSistemKuliah,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    SistemKuliah.findAll.mockRejectedValue(error);

    await getAllSistemKuliah(req, res, next);

    expect(SistemKuliah.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
