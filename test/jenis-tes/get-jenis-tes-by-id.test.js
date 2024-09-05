const httpMocks = require("node-mocks-http");
const { getJenisTesById } = require("../../src/controllers/jenis-tes");
const { JenisTes } = require("../../models");

jest.mock("../../models");

describe("getJenisTesById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if jenisTesId is not provided", async () => {
    req.params.id = undefined;

    await getJenisTesById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Jenis Tes ID is required"
    });
    expect(JenisTes.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if jenis tes is not found", async () => {
    const mockJenisTesId = 1;
    req.params.id = mockJenisTesId;

    JenisTes.findByPk.mockResolvedValue(null);

    await getJenisTesById(req, res, next);

    expect(JenisTes.findByPk).toHaveBeenCalledWith(mockJenisTesId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Jenis Tes With ID ${mockJenisTesId} Not Found:`
    });
  });

  it("should return 200 and the jenis tes if found", async () => {
    const mockJenisTesId = 1;
    const mockJenisTes = {
      id: mockJenisTesId,
      nama_tes: "Tes A",
      deskripsi: "Deskripsi Tes A",
      createdAt: "2024-09-03T03:22:09.000Z",
      updatedAt: "2024-09-03T03:22:09.000Z"
    };

    req.params.id = mockJenisTesId;
    JenisTes.findByPk.mockResolvedValue(mockJenisTes);

    await getJenisTesById(req, res, next);

    expect(JenisTes.findByPk).toHaveBeenCalledWith(mockJenisTesId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Jenis Tes By ID ${mockJenisTesId} Success:`,
      data: mockJenisTes
    });
  });

  it("should handle errors", async () => {
    const mockJenisTesId = 1;
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = mockJenisTesId;
    JenisTes.findByPk.mockRejectedValue(error);

    await getJenisTesById(req, res, next);

    expect(JenisTes.findByPk).toHaveBeenCalledWith(mockJenisTesId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
