const httpMocks = require("node-mocks-http");
const { getSettingWSFeederAktif } = require("../../src/controllers/setting-ws-feeder");
const { SettingWSFeeder } = require("../../models");

jest.mock("../../models");

describe("getSettingWSFeederAktif", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 404 if no active setting WS feeder is found", async () => {
    SettingWSFeeder.findOne.mockResolvedValue(null); // No active setting WS feeder

    await getSettingWSFeederAktif(req, res, next);

    expect(SettingWSFeeder.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Setting WS Feeder Aktif Not Found:`
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 200 and the active setting WS feeder if found", async () => {
    const mockSettingWSFeederAktif = {
      id: 1,
      name: "Active WS Feeder",
      config: "Config Active",
      status: true,
      createdAt: "2024-09-03T03:22:09.000Z",
      updatedAt: "2024-09-03T03:22:09.000Z"
    };

    SettingWSFeeder.findOne.mockResolvedValue(mockSettingWSFeederAktif);

    await getSettingWSFeederAktif(req, res, next);

    expect(SettingWSFeeder.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Setting WS Feeder Aktif Success:`,
      data: mockSettingWSFeederAktif
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    SettingWSFeeder.findOne.mockRejectedValue(error);

    await getSettingWSFeederAktif(req, res, next);

    expect(SettingWSFeeder.findOne).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
