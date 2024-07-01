const httpMocks = require("node-mocks-http");
const { getSettingGlobalById } = require("../../src/controllers/setting-global");
const { SettingGlobal, Prodi, JenjangPendidikan } = require("../../models");

jest.mock("../../models");

describe("getSettingGlobalById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return setting global by ID with status 200 if found", async () => {
    const settingGlobalId = 1;
    const mockSettingGlobal = {
      id: settingGlobalId,
      Prodi: {
        id: 1,
        name: "Prodi 1",
        JenjangPendidikan: { id: 1, name: "S1" },
      },
    };

    req.params.id = settingGlobalId;
    SettingGlobal.findByPk.mockResolvedValue(mockSettingGlobal);

    await getSettingGlobalById(req, res, next);

    expect(SettingGlobal.findByPk).toHaveBeenCalledWith(settingGlobalId, {
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Setting Global By ID ${settingGlobalId} Success:`,
      data: mockSettingGlobal,
    });
  });

  it("should return 404 if setting global ID is not found", async () => {
    const settingGlobalId = 999; // ID yang tidak ada dalam mock data
    req.params.id = settingGlobalId;
    SettingGlobal.findByPk.mockResolvedValue(null);

    await getSettingGlobalById(req, res, next);

    expect(SettingGlobal.findByPk).toHaveBeenCalledWith(settingGlobalId, {
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });
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

    await getSettingGlobalById(req, res, next);

    expect(SettingGlobal.findByPk).toHaveBeenCalledWith(settingGlobalId, {
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });

  it("should return 400 if setting global ID is not provided", async () => {
    req.params.id = null;

    await getSettingGlobalById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Setting Global ID is required",
    });
  });
});
