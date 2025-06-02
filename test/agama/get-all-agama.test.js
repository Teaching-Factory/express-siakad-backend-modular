const httpMocks = require("node-mocks-http");
const { getAllAgamas } = require("../../src/modules/agama/controller");
const { Agama } = require("../../models");

jest.mock("../../models");

describe("getAllAgamas", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return all agamas with status 200", async () => {
    const mockAgamasData = [
      { id: 1, nama: "Islam" },
      { id: 2, nama: "Kristen" },
    ];

    Agama.findAll.mockResolvedValue(mockAgamasData);

    await getAllAgamas(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Agama Success",
      jumlahData: mockAgamasData.length,
      data: mockAgamasData,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    Agama.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllAgamas(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
