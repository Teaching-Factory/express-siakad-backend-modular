const { getAllPeriodePerkuliahan } = require("../../src/modules/periode-perkuliahan/controller");
const { PeriodePerkuliahan } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getAllPeriodePerkuliahan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return all periode perkuliahan with status 200", async () => {
    const mockPeriodePerkuliahanData = [
      {
        id: 1,
        Prodi: { id: 1 },
        Semester: { id: 1 },
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          Prodi: { id: 1 },
          Semester: { id: 1 },
        }),
      },
      {
        id: 2,
        Prodi: { id: 2 },
        Semester: { id: 2 },
        toJSON: jest.fn().mockReturnValue({
          id: 2,
          Prodi: { id: 2 },
          Semester: { id: 2 },
        }),
      },
    ];

    jest.spyOn(PeriodePerkuliahan, "findAll").mockResolvedValue(mockPeriodePerkuliahanData);

    await getAllPeriodePerkuliahan(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Periode Perkuliahan Success",
      jumlahData: mockPeriodePerkuliahanData.length,
      data: mockPeriodePerkuliahanData.map((item) => item.toJSON()),
    });
  });

  it("should return 404 if no periode perkuliahan found", async () => {
    jest.spyOn(PeriodePerkuliahan, "findAll").mockResolvedValue([]);

    await getAllPeriodePerkuliahan(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Periode Perkuliahan Not Found",
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    jest.spyOn(PeriodePerkuliahan, "findAll").mockRejectedValue(new Error(errorMessage));

    await getAllPeriodePerkuliahan(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
