const httpMocks = require("node-mocks-http");
const { getUserGuidePMBAktif } = require("../../src/controllers/user-guide-pmb");
const { UserGuidePMB } = require("../../models");

jest.mock("../../models");

describe("getUserGuidePMBAktif", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 404 if no active user guide PMB is found", async () => {
    UserGuidePMB.findOne.mockResolvedValue(null);

    await getUserGuidePMBAktif(req, res, next);

    expect(UserGuidePMB.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== User Guide PMB Aktif Not Found:"
    });
  });

  it("should return 200 and the active user guide PMB data if found", async () => {
    const mockUserGuidePMB = {
      id: 1,
      type: "pdf",
      file: "http://localhost:4000/src/storage/userguide-pmb/sample.pdf",
      status: true,
      createdAt: "2024-09-03T03:22:09.000Z",
      updatedAt: "2024-09-03T03:22:09.000Z"
    };

    UserGuidePMB.findOne.mockResolvedValue(mockUserGuidePMB);

    await getUserGuidePMBAktif(req, res, next);

    expect(UserGuidePMB.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET User Guide PMB Aktif Success",
      data: mockUserGuidePMB
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    UserGuidePMB.findOne.mockRejectedValue(error);

    await getUserGuidePMBAktif(req, res, next);

    expect(UserGuidePMB.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
