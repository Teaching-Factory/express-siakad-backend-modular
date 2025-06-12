const { getAllDetailPeriodePerkuliahan } = require("../../src/modules/detail-periode-perkuliahan/controller");
const { DetailPeriodePerkuliahan } = require("../../models");
const httpMocks = require("node-mocks-http");

describe("getAllDetailPeriodePerkuliahan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all detail periode perkuliahan with status 200", async () => {
    const mockDetailPeriodePerkuliahanData = [
      {
        id: 1,
        Prodi: { id: 1, nama: "Prodi 1" },
        Semester: { id: 1, nama: "Semester 1" },
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          Prodi: { id: 1, nama: "Prodi 1" },
          Semester: { id: 1, nama: "Semester 1" },
        }),
      },
      {
        id: 2,
        Prodi: { id: 2, nama: "Prodi 2" },
        Semester: { id: 2, nama: "Semester 2" },
        toJSON: jest.fn().mockReturnValue({
          id: 2,
          Prodi: { id: 2, nama: "Prodi 2" },
          Semester: { id: 2, nama: "Semester 2" },
        }),
      },
    ];

    jest.spyOn(DetailPeriodePerkuliahan, "findAll").mockResolvedValue(mockDetailPeriodePerkuliahanData);

    await getAllDetailPeriodePerkuliahan(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Detail Periode Perkuliahan Success",
      jumlahData: mockDetailPeriodePerkuliahanData.length,
      data: mockDetailPeriodePerkuliahanData.map((item) => item.toJSON()),
    });
  });

  it("should return 404 if no detail periode perkuliahan found", async () => {
    jest.spyOn(DetailPeriodePerkuliahan, "findAll").mockResolvedValue([]);

    await getAllDetailPeriodePerkuliahan(req, res, next);

    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Detail Periode Perkuliahan Not Found",
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    jest.spyOn(DetailPeriodePerkuliahan, "findAll").mockRejectedValue(new Error(errorMessage));

    await getAllDetailPeriodePerkuliahan(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
