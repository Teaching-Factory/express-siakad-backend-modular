const httpMocks = require("node-mocks-http");
const { updateSettingWSFeeder } = require("../../src/modules/setting-ws-feeder/controller");
const { SettingWSFeeder } = require("../../models");

jest.mock("../../models");

describe("updateSettingWSFeeder", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if url_feeder is missing", async () => {
    req.body = {
      username_feeder: "user",
      password_feeder: "pass"
    };

    await updateSettingWSFeeder(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "url_feeder is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if username_feeder is missing", async () => {
    req.body = {
      url_feeder: "http://example.com",
      password_feeder: "pass"
    };

    await updateSettingWSFeeder(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "username_feeder is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if password_feeder is missing", async () => {
    req.body = {
      url_feeder: "http://example.com",
      username_feeder: "user"
    };

    await updateSettingWSFeeder(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "password_feeder is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if no active setting WS feeder is found", async () => {
    req.body = {
      url_feeder: "http://example.com",
      username_feeder: "user",
      password_feeder: "pass"
    };

    SettingWSFeeder.findOne.mockResolvedValue(null); // No active setting WS feeder

    await updateSettingWSFeeder(req, res, next);

    expect(SettingWSFeeder.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Setting WS Feeder Not Found:`
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should update the SettingWSFeeder and return 200 if found", async () => {
    const mockSettingWSFeeder = {
      id: 1,
      url_feeder: "http://old-url.com",
      username_feeder: "olduser",
      password_feeder: "oldpass",
      status: true,
      save: jest.fn().mockResolvedValue(true) // Mock save method
    };

    req.body = {
      url_feeder: "http://example.com",
      username_feeder: "user",
      password_feeder: "pass"
    };

    SettingWSFeeder.findOne.mockResolvedValue(mockSettingWSFeeder);

    await updateSettingWSFeeder(req, res, next);

    // Verifikasi bahwa data di-update dengan benar
    expect(mockSettingWSFeeder.url_feeder).toEqual("http://example.com");
    expect(mockSettingWSFeeder.username_feeder).toEqual("user");
    expect(mockSettingWSFeeder.password_feeder).toEqual("pass");

    // Verifikasi bahwa metode save dipanggil
    expect(mockSettingWSFeeder.save).toHaveBeenCalled();

    // Verifikasi bahwa status respons adalah 200
    expect(res.statusCode).toEqual(200);

    // Membuat salinan objek tanpa fungsi `save`
    const expectedResponse = { ...mockSettingWSFeeder };
    delete expectedResponse.save;

    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Setting WS Feeder Success:`,
      data: expectedResponse
    });

    // Verifikasi bahwa next tidak dipanggil
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.body = {
      url_feeder: "http://example.com",
      username_feeder: "user",
      password_feeder: "pass"
    };

    SettingWSFeeder.findOne.mockRejectedValue(error);

    await updateSettingWSFeeder(req, res, next);

    expect(SettingWSFeeder.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
