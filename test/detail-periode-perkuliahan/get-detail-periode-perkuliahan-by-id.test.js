const { getDetailPeriodePerkuliahanById } = require("../../src/controllers/detail-periode-perkuliahan");
const { DetailPeriodePerkuliahan } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getDetailPeriodePerkuliahanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return detail periode perkuliahan with status 200", async () => {
    const DetailPeriodePerkuliahanId = 1;
    req.params.id = DetailPeriodePerkuliahanId;

    const mockDetailPeriodePerkuliahanData = {
      id: DetailPeriodePerkuliahanId,
      Prodi: { id: 1, nama: "Prodi 1" },
      Semester: { id: 1, nama: "Semester 1" },
    };

    jest.spyOn(DetailPeriodePerkuliahan, "findByPk").mockResolvedValue(mockDetailPeriodePerkuliahanData);

    await getDetailPeriodePerkuliahanById(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Detail Periode Perkuliahan By ID ${DetailPeriodePerkuliahanId} Success:`,
      data: mockDetailPeriodePerkuliahanData, // Menghapus .toJSON() dari mockData
    });
  });

  it("should return 404 if detail periode perkuliahan not found", async () => {
    const DetailPeriodePerkuliahanId = 999; // ID yang tidak ada dalam database
    req.params.id = DetailPeriodePerkuliahanId;

    jest.spyOn(DetailPeriodePerkuliahan, "findByPk").mockResolvedValue(null);

    await getDetailPeriodePerkuliahanById(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Detail Periode Perkuliahan With ID ${DetailPeriodePerkuliahanId} Not Found:`,
    });
  });

  it("should return 400 if Detail Periode Perkuliahan ID is not provided", async () => {
    req.params.id = undefined;

    await getDetailPeriodePerkuliahanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Detail Periode Perkuliahan ID is required",
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const DetailPeriodePerkuliahanId = 1;
    req.params.id = DetailPeriodePerkuliahanId;

    jest.spyOn(DetailPeriodePerkuliahan, "findByPk").mockRejectedValue(new Error(errorMessage));

    await getDetailPeriodePerkuliahanById(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });

  //   it("should handle errors", async () => {
  //     const errorMessage = "Database error";
  //     jest.spyOn(DetailPeriodePerkuliahan, "findByPk").mockRejectedValue(new Error(errorMessage));

  //     await getDetailPeriodePerkuliahanById(req, res, next);

  //     expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  //   });
});
