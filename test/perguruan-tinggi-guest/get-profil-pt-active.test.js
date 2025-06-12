const httpMocks = require("node-mocks-http");
const { getProfilPTActive } = require("../../src/modules/perguruan-tinggi-guest/controller");
const { ProfilPT, PerguruanTinggi } = require("../../models");

jest.mock("../../models");

describe("getProfilPTActive", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return profil PT with status 200 if found", async () => {
    const mockProfilPT = { id_profil_pt: 1, PerguruanTinggi: { name: "University Name" } };

    ProfilPT.findOne.mockResolvedValue(mockProfilPT);

    await getProfilPTActive(req, res, next);

    expect(ProfilPT.findOne).toHaveBeenCalledWith({
      where: {
        id_profil_pt: 1,
      },
      include: [{ model: PerguruanTinggi }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET Profil PT Active Success",
      data: mockProfilPT,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    ProfilPT.findOne.mockRejectedValue(new Error(errorMessage));

    await getProfilPTActive(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
