const httpMocks = require("node-mocks-http");
const { getProfilPTActive } = require("../../src/modules/profil-pt/controller");
const { ProfilPT } = require("../../models");

jest.mock("../../models");

describe("getProfilPTActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return profil PT active with status 200", async () => {
    const mockProfilPTData = {
      id_profil_pt: 1,
      name: "PT Example",
      PerguruanTinggi: { name: "Example University" },
      Wilayah: { name: "Example Region" },
    };

    ProfilPT.findOne.mockResolvedValue(mockProfilPTData);

    await getProfilPTActive(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Profil PT Active Success",
      data: mockProfilPTData,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    ProfilPT.findOne.mockRejectedValue(new Error(errorMessage));

    await getProfilPTActive(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
