const { getPeriodePerkuliahanById } = require("../../src/controllers/periode-perkuliahan");
const { PeriodePerkuliahan } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getPeriodePerkuliahanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return periode perkuliahan with status 200", async () => {
    const PeriodePerkuliahanId = 1;
    req.params.id = PeriodePerkuliahanId;

    const mockPeriodePerkuliahanData = {
      id: PeriodePerkuliahanId,
      Prodi: { id: 1 },
      Semester: { id: 1 },
      toJSON: jest.fn().mockReturnValue({
        id: PeriodePerkuliahanId,
        Prodi: { id: 1 },
        Semester: { id: 1 },
      }),
    };

    jest.spyOn(PeriodePerkuliahan, "findByPk").mockResolvedValue(mockPeriodePerkuliahanData);

    await getPeriodePerkuliahanById(req, res, next);

    // Dapatkan data JSON aktual dari respons
    const responseData = res._getJSONData();

    expect(res.statusCode).toEqual(200);
    expect(responseData.message).toEqual(`<===== GET Periode Perkuliahan By ID ${PeriodePerkuliahanId} Success:`);
    expect(responseData.data.id).toEqual(mockPeriodePerkuliahanData.id);
    expect(responseData.data.Prodi.id).toEqual(mockPeriodePerkuliahanData.Prodi.id);
    expect(responseData.data.Semester.id).toEqual(mockPeriodePerkuliahanData.Semester.id);
  });

  it("should return 404 if periode perkuliahan not found", async () => {
    const PeriodePerkuliahanId = 999; // ID yang tidak ada dalam database
    req.params.id = PeriodePerkuliahanId;

    jest.spyOn(PeriodePerkuliahan, "findByPk").mockResolvedValue(null);

    await getPeriodePerkuliahanById(req, res, next);

    // Periksa bahwa status kode respons adalah 404
    expect(res.statusCode).toEqual(404);

    // Periksa bahwa data JSON yang dikembalikan sesuai dengan yang diharapkan
    expect(res._getJSONData()).toEqual({
      message: `<===== Periode Perkuliahan With ID ${PeriodePerkuliahanId} Not Found:`,
    });
  });

  it("should return 400 if Periode Perkuliahan ID is not provided", async () => {
    req.params.id = undefined;

    await getPeriodePerkuliahanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Periode Perkuliahan ID is required",
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Test error");
    PeriodePerkuliahan.findByPk.mockRejectedValue(mockError);

    const req = httpMocks.createRequest({ params: { id: 1 } });
    const res = httpMocks.createResponse();

    const next = jest.fn();

    await getPeriodePerkuliahanById(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
