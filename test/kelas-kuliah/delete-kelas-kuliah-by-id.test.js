const { deleteKelasKuliahById } = require("../../src/modules/kelas-kuliah/controller");
const { KelasKuliah, DetailKelasKuliah } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models", () => ({
  KelasKuliah: {
    findByPk: jest.fn(),
  },
  DetailKelasKuliah: {
    findOne: jest.fn(),
  },
}));

describe("deleteKelasKuliahById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if kelas_kuliah ID is not provided", async () => {
    req.params = {};

    await deleteKelasKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Kelas Kuliah ID is required",
    });
  });

  it("should delete kelas_kuliah by ID successfully", async () => {
    const kelasKuliahId = 1;
    req.params.id_kelas_kuliah = kelasKuliahId;

    const mockKelasKuliah = {
      id_kelas_kuliah: kelasKuliahId,
      destroy: jest.fn().mockResolvedValue(true),
    };

    const mockDetailKelasKuliah = {
      id_kelas_kuliah: kelasKuliahId,
      destroy: jest.fn().mockResolvedValue(true),
    };

    KelasKuliah.findByPk.mockResolvedValue(mockKelasKuliah);
    DetailKelasKuliah.findOne.mockResolvedValue(mockDetailKelasKuliah);

    await deleteKelasKuliahById(req, res, next);

    expect(KelasKuliah.findByPk).toHaveBeenCalledWith(kelasKuliahId);
    expect(DetailKelasKuliah.findOne).toHaveBeenCalledWith({
      where: { id_kelas_kuliah: kelasKuliahId },
    });
    expect(mockKelasKuliah.destroy).toHaveBeenCalled();
    expect(mockDetailKelasKuliah.destroy).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Kelas Kuliah With ID ${kelasKuliahId} Success:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if kelas_kuliah not found", async () => {
    const kelasKuliahId = 1;
    req.params.id_kelas_kuliah = kelasKuliahId;

    KelasKuliah.findByPk.mockResolvedValue(null);

    await deleteKelasKuliahById(req, res, next);

    expect(KelasKuliah.findByPk).toHaveBeenCalledWith(kelasKuliahId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Kelas Kuliah With ID ${kelasKuliahId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors and call next with error", async () => {
    const kelasKuliahId = 1;
    req.params.id_kelas_kuliah = kelasKuliahId;

    const mockError = new Error("Test error");
    KelasKuliah.findByPk.mockRejectedValue(mockError);

    await deleteKelasKuliahById(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
