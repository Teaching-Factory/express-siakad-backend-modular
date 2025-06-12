const httpMocks = require("node-mocks-http");
const { getAllSettingWSFeeder } = require("../../src/modules/setting-ws-feeder/controller");
const { SettingWSFeeder } = require("../../models");

jest.mock("../../models");

describe("getAllSettingWSFeeder", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get all setting WS feeders and return 200 if data is found", async () => {
    const mockSettingWSFeeders = [
      {
        id: 1,
        name: "WS Feeder 1",
        config: "Config 1",
        createdAt: "2024-09-03T03:22:09.000Z",
        updatedAt: "2024-09-03T03:22:09.000Z"
      },
      {
        id: 2,
        name: "WS Feeder 2",
        config: "Config 2",
        createdAt: "2024-09-03T03:22:09.000Z",
        updatedAt: "2024-09-03T03:22:09.000Z"
      }
    ];

    SettingWSFeeder.findAll.mockResolvedValue(mockSettingWSFeeders);

    await getAllSettingWSFeeder(req, res, next);

    expect(SettingWSFeeder.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Setting WS Feeder Success",
      jumlahData: mockSettingWSFeeders.length,
      data: mockSettingWSFeeders
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    SettingWSFeeder.findAll.mockRejectedValue(error);

    await getAllSettingWSFeeder(req, res, next);

    expect(SettingWSFeeder.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
