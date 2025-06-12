const httpMocks = require("node-mocks-http");
const { deleteSettingGlobalById } = require("../../src/modules/setting-global/controller");
const { SettingGlobal } = require("../../models");

jest.mock("../../models");

describe("deleteSettingGlobalById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should delete setting global by ID and return status 200 if found", async () => {
    const settingGlobalId = 1;
    const mockSettingGlobal = { id: settingGlobalId, destroy: jest.fn() };

    req.params.id = settingGlobalId;
    SettingGlobal.findByPk.mockResolvedValue(mockSettingGlobal);

    await deleteSettingGlobalById(req, res, next);

    expect(SettingGlobal.findByPk).toHaveBeenCalledWith(settingGlobalId);
    expect(mockSettingGlobal.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Setting Global With ID ${settingGlobalId} Success:`,
    });
  });

  it("should return 400 if setting global ID is not provided", async () => {
    req.params.id = null;

    await deleteSettingGlobalById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Setting Global ID is required",
    });
  });

  it("should return 404 if setting global ID is not found", async () => {
    const settingGlobalId = 999; // ID yang tidak ada dalam mock data

    req.params.id = settingGlobalId;
    SettingGlobal.findByPk.mockResolvedValue(null);

    await deleteSettingGlobalById(req, res, next);

    expect(SettingGlobal.findByPk).toHaveBeenCalledWith(settingGlobalId);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Setting Global With ID ${settingGlobalId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const settingGlobalId = 1;
    const errorMessage = "Database error";

    req.params.id = settingGlobalId;
    SettingGlobal.findByPk.mockRejectedValue(new Error(errorMessage));

    await deleteSettingGlobalById(req, res, next);

    expect(SettingGlobal.findByPk).toHaveBeenCalledWith(settingGlobalId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
