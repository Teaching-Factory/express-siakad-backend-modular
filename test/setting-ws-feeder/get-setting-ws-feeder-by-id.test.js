const httpMocks = require("node-mocks-http");
const { getSettingWSFeederById } = require("../../src/controllers/setting-ws-feeder");
const { SettingWSFeeder } = require("../../models");

jest.mock("../../models");

describe("getSettingWSFeederById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if ID is not provided", async () => {
    req.params = {}; // No ID provided

    await getSettingWSFeederById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Setting WS Feeder ID is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if setting WS feeder is not found", async () => {
    const settingWsFeederId = 1;
    req.params = { id: settingWsFeederId };

    SettingWSFeeder.findByPk.mockResolvedValue(null); // No data found

    await getSettingWSFeederById(req, res, next);

    expect(SettingWSFeeder.findByPk).toHaveBeenCalledWith(settingWsFeederId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Setting WS Feeder With ID ${settingWsFeederId} Not Found:`
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 200 and the setting WS feeder if found", async () => {
    const settingWsFeederId = 1;
    req.params = { id: settingWsFeederId };

    const mockSettingWSFeeder = {
      id: settingWsFeederId,
      name: "WS Feeder 1",
      config: "Config 1",
      createdAt: "2024-09-03T03:22:09.000Z",
      updatedAt: "2024-09-03T03:22:09.000Z"
    };

    SettingWSFeeder.findByPk.mockResolvedValue(mockSettingWSFeeder);

    await getSettingWSFeederById(req, res, next);

    expect(SettingWSFeeder.findByPk).toHaveBeenCalledWith(settingWsFeederId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Setting WS Feeder By ID ${settingWsFeederId} Success:`,
      data: mockSettingWSFeeder
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    SettingWSFeeder.findByPk.mockRejectedValue(error);

    await getSettingWSFeederById(req, res, next);
  });
});
