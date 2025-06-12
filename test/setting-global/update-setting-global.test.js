const httpMocks = require("node-mocks-http");
const { updateSettingGlobal } = require("../../src/modules/setting-global/controller");
const { SettingGlobal } = require("../../models");

jest.mock("../../models");

describe("updateSettingGlobal", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 400 if request body format is invalid", async () => {
    req.body.setting_globals = {};

    await updateSettingGlobal(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Invalid request body format. 'setting_globals' should be an array.",
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    req.body.setting_globals = [{ id: 1, access: [{ open_krs: true }] }];

    SettingGlobal.update.mockRejectedValue(new Error(errorMessage));

    await updateSettingGlobal(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
