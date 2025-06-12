const httpMocks = require("node-mocks-http");
const { getUserGuidePMBById } = require("../../src/modules/user-guide-pmb/controller");
const { UserGuidePMB } = require("../../models");

jest.mock("../../models");

describe("getUserGuidePMBById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return user guide pmb by id and status 200", async () => {
    const mockUserGuidePMB = { id: 1, type: "guide1", file: "http://example.com/file1.pdf", status: true };
    req.params.id = 1;

    UserGuidePMB.findByPk.mockResolvedValue(mockUserGuidePMB);

    await getUserGuidePMBById(req, res, next);

    expect(UserGuidePMB.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET User Guide PMB By ID 1 Success:",
      data: mockUserGuidePMB
    });
  });

  it("should handle when ID is not provided", async () => {
    req.params.id = undefined;

    await getUserGuidePMBById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "User Guide PMB ID is required"
    });
  });

  it("should handle when user guide pmb is not found", async () => {
    req.params.id = 1;
    UserGuidePMB.findByPk.mockResolvedValue(null);

    await getUserGuidePMBById(req, res, next);

    expect(UserGuidePMB.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== User Guide PMB With ID 1 Not Found:"
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    UserGuidePMB.findByPk.mockRejectedValue(error);

    await getUserGuidePMBById(req, res, next);
  });
});
