const httpMocks = require("node-mocks-http");
const { openPertemuanPerkuliahan } = require("../../src/controllers/pertemuan-perkuliahan");
const { PertemuanPerkuliahan, RuangPerkuliahan, KelasKuliah } = require("../../models");

jest.mock("../../models");

describe("openPertemuanPerkuliahan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 404 if pertemuan_perkuliahan is not found", async () => {
    PertemuanPerkuliahan.findOne.mockResolvedValue(null);

    req.body = {
      id_kelas_kuliah: "123",
      id_pertemuan_perkuliahan: "456",
    };

    await openPertemuanPerkuliahan(req, res, next);

    expect(PertemuanPerkuliahan.findOne).toHaveBeenCalledWith({
      where: {
        id: "456",
        id_kelas_kuliah: "123",
      },
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah }],
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Pertemuan Perkuliahan Not Found:",
    });
  });

  it("should return 200 and update buka_presensi if request is successful", async () => {
    const mockPertemuanPerkuliahan = {
      id: "456",
      id_kelas_kuliah: "123",
      buka_presensi: false,
      save: jest.fn().mockResolvedValue(true),
      RuangPerkuliahan: {},
      KelasKuliah: {},
    };

    PertemuanPerkuliahan.findOne.mockResolvedValue(mockPertemuanPerkuliahan);

    req.body = {
      id_kelas_kuliah: "123",
      id_pertemuan_perkuliahan: "456",
    };

    await openPertemuanPerkuliahan(req, res, next);

    expect(PertemuanPerkuliahan.findOne).toHaveBeenCalledWith({
      where: {
        id: "456",
        id_kelas_kuliah: "123",
      },
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah }],
    });
    expect(mockPertemuanPerkuliahan.buka_presensi).toBe(true);
    expect(mockPertemuanPerkuliahan.save).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);

    // Copy the mockPertemuanPerkuliahan object to ensure that the save function is removed
    const expectedData = { ...mockPertemuanPerkuliahan };
    delete expectedData.save;

    expect(res._getJSONData()).toEqual({
      message: "<===== OPEN Pertemuan Perkuliahan Success",
      data: expectedData,
    });
  });

  it("should handle errors", async () => {
    const error = new Error("Test error");
    PertemuanPerkuliahan.findOne.mockRejectedValue(error);

    req.body = {
      id_kelas_kuliah: "123",
      id_pertemuan_perkuliahan: "456",
    };

    await openPertemuanPerkuliahan(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
