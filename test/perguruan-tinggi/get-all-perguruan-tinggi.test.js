const httpMocks = require("node-mocks-http");
const { getAllPerguruanTinggi } = require("../../src/controllers/perguruan-tinggi");
const { PerguruanTinggi } = require("../../models");

jest.mock("../../models");

describe("getAllPerguruanTinggi", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return all perguruan_tinggi data with status 200 if found", async () => {
    const mockPerguruanTinggi = [
      { id: 1, nama: "Perguruan Tinggi 1" },
      { id: 2, nama: "Perguruan Tinggi 2" },
    ];

    PerguruanTinggi.findAll.mockResolvedValue(mockPerguruanTinggi);

    await getAllPerguruanTinggi(req, res, next);

    expect(PerguruanTinggi.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Perguruan Tinggi Success",
      jumlahData: mockPerguruanTinggi.length,
      data: mockPerguruanTinggi,
    });
  });

  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";

    PerguruanTinggi.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllPerguruanTinggi(req, res, next);

    expect(PerguruanTinggi.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
