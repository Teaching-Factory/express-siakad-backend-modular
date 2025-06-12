const httpMocks = require("node-mocks-http");
const { updatePemberkasanCamabaActiveById } = require("../../src/modules/pemberkasan-camaba/controller");
const { Role, Camaba, PemberkasanCamaba } = require("../../models");
const path = require("path");
const fs = require("fs");

jest.mock("../../models");

describe("updatePemberkasanCamabaActiveById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if no ID is provided", async () => {
    req.params.id = null;

    await updatePemberkasanCamabaActiveById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Pemberkasan Camaba ID is required"
    });
  });

  it("should return 404 if role camaba is not found", async () => {
    req.params.id = 1;
    req.user = { username: "camaba123" };

    Role.findOne.mockResolvedValue(null);

    await updatePemberkasanCamabaActiveById(req, res, next);

    expect(Role.findOne).toHaveBeenCalledWith({ where: { nama_role: "camaba" } });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: "Role Camaba not found"
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.params.id = 1;
    req.user = { username: "camaba123" };

    Role.findOne.mockRejectedValue(error);

    await updatePemberkasanCamabaActiveById(req, res, next);

    expect(Role.findOne).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
