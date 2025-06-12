const httpMocks = require("node-mocks-http");
const { deleteSistemKuliahById } = require("../../src/modules/sistem-kuliah/controller");
const { SistemKuliah } = require("../../models");

jest.mock("../../models");

describe("deleteSistemKuliahById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should delete sistem kuliah and return 200 if valid ID is provided", async () => {
    const sistemKuliahId = 1;
    req.params.id = sistemKuliahId;

    const mockSistemKuliah = {
      id: sistemKuliahId,
      nama_sk: "Sistem Kuliah Test",
      kode_sk: "SKT001",
      destroy: jest.fn().mockResolvedValue({}),
    };

    SistemKuliah.findByPk.mockResolvedValue(mockSistemKuliah);

    await deleteSistemKuliahById(req, res, next);

    expect(SistemKuliah.findByPk).toHaveBeenCalledWith(sistemKuliahId);
    expect(mockSistemKuliah.destroy).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Sistem Kuliah With ID ${sistemKuliahId} Success:`,
    });
  });

  it("should return 400 if Sistem Kuliah ID is not provided", async () => {
    req.params.id = undefined;

    await deleteSistemKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Sistem Kuliah Mahasiswa ID is required",
    });
    expect(SistemKuliah.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if Sistem Kuliah is not found", async () => {
    const sistemKuliahId = 999; // ID yang tidak ada dalam database
    req.params.id = sistemKuliahId;

    SistemKuliah.findByPk.mockResolvedValue(null);

    await deleteSistemKuliahById(req, res, next);

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

    await deleteSistemKuliahById(req, res, next);

    expect(SistemKuliah.findByPk).toHaveBeenCalledWith(sistemKuliahId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
