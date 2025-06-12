const httpMocks = require("node-mocks-http");
const { getSistemKuliahById } = require("../../src/modules/sistem-kuliah/controller");
const { SistemKuliah } = require("../../models");

jest.mock("../../models");

describe("getSistemKuliahById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get sistem kuliah by ID and return 200 if found", async () => {
    const sistemKuliahId = 1;
    const mockSistemKuliah = {
      id: sistemKuliahId,
      nama: "Sistem Kuliah A",
    };

    req.params.id = sistemKuliahId;

    SistemKuliah.findByPk.mockResolvedValue(mockSistemKuliah);

    await getSistemKuliahById(req, res, next);

    expect(SistemKuliah.findByPk).toHaveBeenCalledWith(sistemKuliahId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Sistem Kuliah By ID ${sistemKuliahId} Success:`,
      data: mockSistemKuliah,
    });
  });

  it("should return 400 if sistem kuliah ID is not provided", async () => {
    req.params.id = undefined;

    await getSistemKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Sistem Kuliah Mahasiswa ID is required",
    });
    expect(SistemKuliah.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if sistem kuliah is not found", async () => {
    const sistemKuliahId = 999; // ID yang tidak ada dalam database
    req.params.id = sistemKuliahId;

    SistemKuliah.findByPk.mockResolvedValue(null);

    await getSistemKuliahById(req, res, next);

    expect(SistemKuliah.findByPk).toHaveBeenCalledWith(sistemKuliahId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Sistem Kuliah With ID ${sistemKuliahId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const sistemKuliahId = 1;
    req.params.id = sistemKuliahId;

    SistemKuliah.findByPk.mockRejectedValue(error);

    await getSistemKuliahById(req, res, next);

    expect(SistemKuliah.findByPk).toHaveBeenCalledWith(sistemKuliahId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
