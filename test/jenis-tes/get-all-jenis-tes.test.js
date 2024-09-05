const httpMocks = require("node-mocks-http");
const { getAllJenisTes } = require("../../src/controllers/jenis-tes");
const { JenisTes } = require("../../models");

jest.mock("../../models");

describe("getAllJenisTes", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get all jenis tes and return 200 if data is found", async () => {
    const mockJenisTes = [
      {
        id: 1,
        nama_tes: "Tes A",
        deskripsi: "Deskripsi Tes A",
        createdAt: "2024-09-03T03:22:09.000Z",
        updatedAt: "2024-09-03T03:22:09.000Z"
      },
      {
        id: 2,
        nama_tes: "Tes B",
        deskripsi: "Deskripsi Tes B",
        createdAt: "2024-09-03T03:22:09.000Z",
        updatedAt: "2024-09-03T03:22:09.000Z"
      }
    ];

    JenisTes.findAll.mockResolvedValue(mockJenisTes);

    await getAllJenisTes(req, res, next);

    expect(JenisTes.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Jenis Tes Success",
      jumlahData: mockJenisTes.length,
      data: mockJenisTes
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    JenisTes.findAll.mockRejectedValue(error);

    await getAllJenisTes(req, res, next);

    expect(JenisTes.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
