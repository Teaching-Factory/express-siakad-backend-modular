const httpMocks = require("node-mocks-http");
const { closePertemuanPerkuliahanById } = require("../../src/controllers/pertemuan-perkuliahan");
const { PertemuanPerkuliahan, RuangPerkuliahan, KelasKuliah } = require("../../models");

jest.mock("../../models");

describe("closePertemuanPerkuliahanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 200 and update buka_presensi to false if request is successful", async () => {
    const pertemuanPerkuliahanId = "456";
    const mockPertemuanPerkuliahan = {
      id: pertemuanPerkuliahanId,
      id_kelas_kuliah: "123",
      buka_presensi: true,
      save: jest.fn().mockResolvedValue(true),
      RuangPerkuliahan: {},
      KelasKuliah: {},
    };

    PertemuanPerkuliahan.findByPk.mockResolvedValue(mockPertemuanPerkuliahan);

    req.params.id = pertemuanPerkuliahanId;

    await closePertemuanPerkuliahanById(req, res, next);

    expect(PertemuanPerkuliahan.findByPk).toHaveBeenCalledWith(pertemuanPerkuliahanId, {
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah }],
    });
    expect(mockPertemuanPerkuliahan.buka_presensi).toBe(false);
    expect(mockPertemuanPerkuliahan.save).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);

    // Copy the mockPertemuanPerkuliahan object to ensure that the save function is removed
    const expectedData = { ...mockPertemuanPerkuliahan };
    delete expectedData.save;

    expect(res._getJSONData()).toEqual({
      message: `<===== CLOSE Pertemuan Perkuliahan By ID ${pertemuanPerkuliahanId} Success`,
      data: expectedData,
    });
  });

  it("should return 404 if pertemuan_perkuliahan is not found", async () => {
    const pertemuanPerkuliahanId = "999";
    PertemuanPerkuliahan.findByPk.mockResolvedValue(null);

    req.params.id = pertemuanPerkuliahanId;

    await closePertemuanPerkuliahanById(req, res, next);

    expect(PertemuanPerkuliahan.findByPk).toHaveBeenCalledWith(pertemuanPerkuliahanId, {
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah }],
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Pertemuan Perkuliahan With ID ${pertemuanPerkuliahanId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const pertemuanPerkuliahanId = "456";
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    PertemuanPerkuliahan.findByPk.mockRejectedValue(error);

    req.params.id = pertemuanPerkuliahanId;

    await closePertemuanPerkuliahanById(req, res, next);

    expect(PertemuanPerkuliahan.findByPk).toHaveBeenCalledWith(pertemuanPerkuliahanId, {
      include: [{ model: RuangPerkuliahan }, { model: KelasKuliah }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });

  it("should handle missing pertemuan_perkuliahan ID", async () => {
    req.params.id = undefined;

    await closePertemuanPerkuliahanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Pertemuan Perkuliahan ID is required",
    });

    expect(PertemuanPerkuliahan.findByPk).not.toHaveBeenCalled();
  });
});
