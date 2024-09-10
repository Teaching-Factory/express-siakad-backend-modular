const httpMocks = require("node-mocks-http");
const { getAllUserGuidePMB } = require("../../src/controllers/user-guide-pmb");
const { UserGuidePMB } = require("../../models");

jest.mock("../../models");

describe("getAllUserGuidePMB", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return all user guide pmb and status 200", async () => {
    const mockUserGuidePMBs = [
      { id: 1, type: "guide1", file: "http://example.com/file1.pdf", status: true },
      { id: 2, type: "guide2", file: "http://example.com/file2.pdf", status: true }
    ];

    UserGuidePMB.findAll.mockResolvedValue(mockUserGuidePMBs);

    await getAllUserGuidePMB(req, res, next);

    expect(UserGuidePMB.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All User Guide PMB Success",
      jumlahData: mockUserGuidePMBs.length,
      data: mockUserGuidePMBs
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    UserGuidePMB.findAll.mockRejectedValue(error);

    await getAllUserGuidePMB(req, res, next);

    expect(UserGuidePMB.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
