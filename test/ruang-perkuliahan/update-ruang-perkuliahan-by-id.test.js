const httpMocks = require("node-mocks-http");
const { updateRuangPerkuliahanById } = require("../../src/modules/ruang-perkuliahan/controller");
const { RuangPerkuliahan } = require("../../models");

jest.mock("../../models");

describe("updateRuangPerkuliahanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should update ruang perkuliahan by ID and return 200", async () => {
    const mockRuangPerkuliahanId = 1;
    const mockRuangPerkuliahan = {
      id: mockRuangPerkuliahanId,
      id_ruang: 1,
      nama_ruang_perkuliahan: "Ruang 101",
      lokasi: "Gedung A",
      save: jest.fn().mockResolvedValue(true),
    };

    req.params.id = mockRuangPerkuliahanId;
    req.body = {
      id_ruang: 1,
      nama_ruang_perkuliahan: "Ruang 102",
      lokasi: "Gedung B",
    };

    RuangPerkuliahan.findByPk.mockResolvedValue(mockRuangPerkuliahan);

    await updateRuangPerkuliahanById(req, res, next);

    expect(RuangPerkuliahan.findByPk).toHaveBeenCalledWith(mockRuangPerkuliahanId);
    expect(mockRuangPerkuliahan.save).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Ruang Perkuliahan With ID ${mockRuangPerkuliahanId} Success:`,
      data: {
        id: mockRuangPerkuliahanId,
        id_ruang: mockRuangPerkuliahan.id_ruang,
        nama_ruang_perkuliahan: mockRuangPerkuliahan.nama_ruang_perkuliahan,
        lokasi: mockRuangPerkuliahan.lokasi,
      },
    });
  });

  it("should return 400 if id_ruang is missing", async () => {
    req.params.id = 1;
    req.body = {
      nama_ruang_perkuliahan: "Ruang 101",
      lokasi: "Gedung A",
    };

    await updateRuangPerkuliahanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "id_ruang is required" });
    expect(RuangPerkuliahan.findByPk).not.toHaveBeenCalled();
  });

  it("should return 400 if nama_ruang_perkuliahan is missing", async () => {
    req.params.id = 1;
    req.body = {
      id_ruang: 1,
      lokasi: "Gedung A",
    };

    await updateRuangPerkuliahanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "nama_ruang_perkuliahan is required" });
    expect(RuangPerkuliahan.findByPk).not.toHaveBeenCalled();
  });

  it("should return 400 if lokasi is missing", async () => {
    req.params.id = 1;
    req.body = {
      id_ruang: 1,
      nama_ruang_perkuliahan: "Ruang 101",
    };

    await updateRuangPerkuliahanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "lokasi is required" });
    expect(RuangPerkuliahan.findByPk).not.toHaveBeenCalled();
  });

  it("should return 400 if ruang perkuliahan ID is missing", async () => {
    req.params.id = undefined;
    req.body = {
      id_ruang: 1,
      nama_ruang_perkuliahan: "Ruang 101",
      lokasi: "Gedung A",
    };

    await updateRuangPerkuliahanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({ message: "Ruang Perkuliahan ID is required" });
    expect(RuangPerkuliahan.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if ruang perkuliahan not found", async () => {
    const mockRuangPerkuliahanId = 999; // Non-existent ID
    req.params.id = mockRuangPerkuliahanId;
    req.body = {
      id_ruang: 1,
      nama_ruang_perkuliahan: "Ruang 101",
      lokasi: "Gedung A",
    };

    RuangPerkuliahan.findByPk.mockResolvedValue(null);

    await updateRuangPerkuliahanById(req, res, next);

    expect(RuangPerkuliahan.findByPk).toHaveBeenCalledWith(mockRuangPerkuliahanId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Ruang Perkuliahan With ID ${mockRuangPerkuliahanId} Not Found:`,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const mockRuangPerkuliahanId = 1;
    req.params.id = mockRuangPerkuliahanId;
    req.body = {
      id_ruang: 1,
      nama_ruang_perkuliahan: "Ruang 101",
      lokasi: "Gedung A",
    };

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    RuangPerkuliahan.findByPk.mockRejectedValue(error);

    await updateRuangPerkuliahanById(req, res, next);

    expect(RuangPerkuliahan.findByPk).toHaveBeenCalledWith(mockRuangPerkuliahanId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
