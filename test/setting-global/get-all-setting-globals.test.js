const httpMocks = require("node-mocks-http");
const { getAllSettingGlobals } = require("../../src/controllers/setting-global");
const { SettingGlobal, Prodi, JenjangPendidikan } = require("../../models");

jest.mock("../../models");

describe("getAllSettingGlobals", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return all setting globals with status 200", async () => {
    const mockSettingGlobals = [
      {
        id: 1,
        Prodi: {
          id: 1,
          name: "Prodi 1",
          JenjangPendidikan: { id: 1, name: "S1" },
        },
      },
      {
        id: 2,
        Prodi: {
          id: 2,
          name: "Prodi 2",
          JenjangPendidikan: { id: 2, name: "S2" },
        },
      },
    ];

    SettingGlobal.findAll.mockResolvedValue(mockSettingGlobals);

    await getAllSettingGlobals(req, res, next);

    expect(SettingGlobal.findAll).toHaveBeenCalledWith({
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Setting Global Success",
      jumlahData: mockSettingGlobals.length,
      data: mockSettingGlobals,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    SettingGlobal.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllSettingGlobals(req, res, next);

    expect(SettingGlobal.findAll).toHaveBeenCalledWith({
      include: [{ model: Prodi, include: [{ model: JenjangPendidikan }] }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
