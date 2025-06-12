const httpMocks = require("node-mocks-http");
const { getAspekPenilaianDosenById } = require("../../src/modules/aspek-penilaian-dosen/controller");
const { AspekPenilaianDosen, Semester } = require("../../models");

jest.mock("../../models");

describe("getAspekPenilaianDosenById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return aspek_penilaian_dosen by ID with status 200", async () => {
    // Setup mock data
    const mockAspekPenilaianDosen = {
      id: 1,
      nama_aspek: "Aspek 1",
      id_semester: 1,
      Semester: { id: 1, nama_semester: "Semester 1" }
    };

    // Set up mock implementation
    AspekPenilaianDosen.findByPk.mockResolvedValue(mockAspekPenilaianDosen);

    // Set request parameters
    req.params.id = 1;

    // Call the controller function
    await getAspekPenilaianDosenById(req, res, next);

    // Assertions
    expect(AspekPenilaianDosen.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Semester }]
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Aspek Penilaian Dosen By ID 1 Success:`,
      data: mockAspekPenilaianDosen
    });
  });

  it("should return 400 if aspekPenilaianDosenId is missing", async () => {
    // Call the controller function without setting id
    await getAspekPenilaianDosenById(req, res, next);

    // Assertions
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Aspek Penilaian Dosen ID is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if aspek_penilaian_dosen is not found", async () => {
    // Setup mock to return null
    AspekPenilaianDosen.findByPk.mockResolvedValue(null);

    // Set request parameters
    req.params.id = 1;

    // Call the controller function
    await getAspekPenilaianDosenById(req, res, next);

    // Assertions
    expect(AspekPenilaianDosen.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Semester }]
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Aspek Penilaian Dosen With ID 1 Not Found:`
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    AspekPenilaianDosen.findByPk.mockRejectedValue(error);

    // Set request parameters
    req.params.id = 1;

    // Call the controller function
    await getAspekPenilaianDosenById(req, res, next);

    // Assertions
    expect(AspekPenilaianDosen.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: Semester }]
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
