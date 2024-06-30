const httpMocks = require("node-mocks-http");
const { createSettingGlobal } = require("../../src/controllers/setting-global");
const { SettingGlobal } = require("../../models");

jest.mock("../../models");

describe("createSettingGlobal", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should create a new setting global and return status 201", async () => {
    const id_prodi = 1;
    const mockSettingGlobal = { id: 1, id_prodi };

    req.body.id_prodi = id_prodi;
    SettingGlobal.create.mockResolvedValue(mockSettingGlobal);

    await createSettingGlobal(req, res, next);

    expect(SettingGlobal.create).toHaveBeenCalledWith({ id_prodi });
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Setting Global Success",
      data: mockSettingGlobal,
    });
  });

  it("should return 400 if id_prodi is not provided", async () => {
    req.body.id_prodi = null;

    await createSettingGlobal(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "id_prodi is required",
    });
  });

  it("should handle errors", async () => {
    const id_prodi = 1;
    const errorMessage = "Database error";

    req.body.id_prodi = id_prodi;
    SettingGlobal.create.mockRejectedValue(new Error(errorMessage));

    await createSettingGlobal(req, res, next);

    expect(SettingGlobal.create).toHaveBeenCalledWith({ id_prodi });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
