const httpMocks = require("node-mocks-http");
const { updatePeriodeYudisiumById } = require("../../src/modules/periode-yudisium/controller");
const { PeriodeYudisium } = require("../../models");

jest.mock("../../models");

describe("updatePeriodeYudisiumById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if nama_periode_yudisium is not provided", async () => {
    req.body = { id_semester: 1 };
    req.params.id = 1;

    await updatePeriodeYudisiumById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_periode_yudisium is required"
    });
  });

  it("should return 400 if id_semester is not provided", async () => {
    req.body = { nama_periode_yudisium: "Periode Yudisium 1" };
    req.params.id = 1;

    await updatePeriodeYudisiumById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "id_semester is required"
    });
  });

  it("should return 404 if periode yudisium is not found", async () => {
    req.body = { nama_periode_yudisium: "Periode Yudisium 1", id_semester: 1 };
    req.params.id = 999; // ID yang tidak ada
    PeriodeYudisium.findByPk.mockResolvedValue(null);

    await updatePeriodeYudisiumById(req, res, next);

    expect(PeriodeYudisium.findByPk).toHaveBeenCalledWith(999);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Periode Yudisium With ID 999 Not Found:`
    });
  });

  it("should update periode yudisium and return 200 if successful", async () => {
    const mockPeriodeYudisium = {
      id: 1,
      nama_periode_yudisium: "Periode Yudisium Lama",
      id_semester: 1,
      save: jest.fn().mockResolvedValue(true)
    };

    req.body = { nama_periode_yudisium: "Periode Yudisium Baru", id_semester: 2 };
    req.params.id = 1;

    PeriodeYudisium.findByPk.mockResolvedValue(mockPeriodeYudisium);

    await updatePeriodeYudisiumById(req, res, next);

    expect(PeriodeYudisium.findByPk).toHaveBeenCalledWith(1);
    expect(mockPeriodeYudisium.nama_periode_yudisium).toBe("Periode Yudisium Baru");
    expect(mockPeriodeYudisium.id_semester).toBe(2);
    expect(mockPeriodeYudisium.save).toHaveBeenCalled();

    expect(res.statusCode).toBe(200);

    // Hapus properti `save` saat membandingkan hasil JSON
    const expectedResponse = {
      message: `<===== UPDATE Periode Yudisium With ID 1 Success:`,
      data: {
        id: 1,
        nama_periode_yudisium: "Periode Yudisium Baru",
        id_semester: 2
      }
    };

    expect(res._getJSONData()).toEqual(expectedResponse);
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.body = { nama_periode_yudisium: "Periode Yudisium Baru", id_semester: 2 };
    req.params.id = 1;

    PeriodeYudisium.findByPk.mockRejectedValue(error);

    await updatePeriodeYudisiumById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
