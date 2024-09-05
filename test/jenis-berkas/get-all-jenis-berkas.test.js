const httpMocks = require("node-mocks-http");
const { getAllJenisBerkas } = require("../../src/controllers/jenis-berkas");
const { JenisBerkas } = require("../../models");

jest.mock("../../models");

describe("getAllJenisBerkas", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get all jenis berkas and return 200 if data is found", async () => {
    const mockJenisBerkas = [
      {
        id: 1,
        nama_berkas: "Berkas A",
        deskripsi: "Deskripsi Berkas A",
        createdAt: "2024-09-03T03:22:09.000Z",
        updatedAt: "2024-09-03T03:22:09.000Z"
      },
      {
        id: 2,
        nama_berkas: "Berkas B",
        deskripsi: "Deskripsi Berkas B",
        createdAt: "2024-09-03T03:22:09.000Z",
        updatedAt: "2024-09-03T03:22:09.000Z"
      }
    ];

    JenisBerkas.findAll.mockResolvedValue(mockJenisBerkas);

    await getAllJenisBerkas(req, res, next);

    expect(JenisBerkas.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Jenis Berkas Success",
      jumlahData: mockJenisBerkas.length,
      data: mockJenisBerkas
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    JenisBerkas.findAll.mockRejectedValue(error);

    await getAllJenisBerkas(req, res, next);

    expect(JenisBerkas.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
