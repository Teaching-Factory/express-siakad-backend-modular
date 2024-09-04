const httpMocks = require("node-mocks-http");
const { createSettingWSFeeder } = require("../../src/controllers/setting-ws-feeder");
const { SettingWSFeeder } = require("../../models");

jest.mock("../../models");

describe("createSettingWSFeeder", () => {
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
      password_feeder: "pass",
      status: true
    };

    await createSettingWSFeeder(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "url_feeder is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if username_feeder is missing", async () => {
    req.body = {
      url_feeder: "http://example.com",
      password_feeder: "pass",
      status: true
    };

    await createSettingWSFeeder(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "username_feeder is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if password_feeder is missing", async () => {
    req.body = {
      url_feeder: "http://example.com",
      username_feeder: "user",
      status: true
    };

    await createSettingWSFeeder(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "password_feeder is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if status is missing", async () => {
    req.body = {
      url_feeder: "http://example.com",
      username_feeder: "user",
      password_feeder: "pass"
    };

    await createSettingWSFeeder(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "status is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should create a new setting WS feeder and return 201", async () => {
    const newSettingWSFeeder = {
      id: 1,
      url_feeder: "http://example.com",
      username_feeder: "user",
      password_feeder: "pass",
      status: true,
      createdAt: "2024-09-03T03:22:09.000Z",
      updatedAt: "2024-09-03T03:22:09.000Z"
    };

    req.body = {
      url_feeder: "http://example.com",
      username_feeder: "user",
      password_feeder: "pass",
      status: true
    };

    SettingWSFeeder.create.mockResolvedValue(newSettingWSFeeder);

    await createSettingWSFeeder(req, res, next);

    expect(SettingWSFeeder.create).toHaveBeenCalledWith({
      url_feeder: "http://example.com",
      username_feeder: "user",
      password_feeder: "pass",
      status: true
    });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Setting WS Feeder Success",
      data: newSettingWSFeeder
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.body = {
      url_feeder: "http://example.com",
      username_feeder: "user",
      password_feeder: "pass",
      status: true
    };

    SettingWSFeeder.create.mockRejectedValue(error);

    await createSettingWSFeeder(req, res, next);

    expect(SettingWSFeeder.create).toHaveBeenCalledWith({
      url_feeder: "http://example.com",
      username_feeder: "user",
      password_feeder: "pass",
      status: true
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
