const httpMocks = require("node-mocks-http");
const { createSumber } = require("../../src/controllers/sumber");
const { Sumber } = require("../../models");

jest.mock("../../models");

describe("createSumber", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if nama_sumber is not provided", async () => {
    req.body = {}; // Tidak ada nama_sumber

    await createSumber(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_sumber is required"
    });
  });

  it("should create a new sumber and return 201 if successful", async () => {
    const mockSumber = { id: 1, nama_sumber: "Sumber Test" };
    req.body = { nama_sumber: "Sumber Test" };

    Sumber.create.mockResolvedValue(mockSumber); // Simulasi create sumber

    await createSumber(req, res, next);

    expect(Sumber.create).toHaveBeenCalledWith({
      nama_sumber: "Sumber Test"
    });
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Sumber Success",
      data: mockSumber
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    req.body = { nama_sumber: "Sumber Test" };

    Sumber.create.mockRejectedValue(error); // Simulasi error

    await createSumber(req, res, next);

    expect(Sumber.create).toHaveBeenCalledWith({
      nama_sumber: "Sumber Test"
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
