const { getProfilPTById } = require("../../src/controllers/profil-pt");
const { ProfilPT, PerguruanTinggi, Wilayah } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models");

describe("getProfilPTById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 200 and profil_pt data if found", async () => {
    const profilPTId = 1;
    const mockProfilPT = {
      id: profilPTId,
      PerguruanTinggi: { id: 1, name: "PT 1" },
      Wilayah: { id: 1, name: "Wilayah 1" },
    };

    ProfilPT.findByPk.mockResolvedValue(mockProfilPT);

    req.params.id = profilPTId;

    await getProfilPTById(req, res, next);

    expect(ProfilPT.findByPk).toHaveBeenCalledWith(profilPTId, {
      include: [{ model: PerguruanTinggi }, { model: Wilayah }],
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Profil PT By ID ${profilPTId} Success:`,
      data: mockProfilPT,
    });
  });

  it("should return 404 if profil_pt is not found", async () => {
    const profilPTId = 1;

    ProfilPT.findByPk.mockResolvedValue(null);

    req.params.id = profilPTId;

    await getProfilPTById(req, res, next);

    expect(ProfilPT.findByPk).toHaveBeenCalledWith(profilPTId, {
      include: [{ model: PerguruanTinggi }, { model: Wilayah }],
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Profil PT With ID ${profilPTId} Not Found:`,
    });
  });

  it("should handle errors correctly", async () => {
    const errorMessage = "Database error";
    const profilPTId = 1;
    const rejectedPromise = Promise.reject(new Error(errorMessage));
    ProfilPT.findByPk.mockReturnValue(rejectedPromise);

    req.params.id = profilPTId;

    await getProfilPTById(req, res, next);

    expect(ProfilPT.findByPk).toHaveBeenCalledWith(profilPTId, {
      include: [{ model: PerguruanTinggi }, { model: Wilayah }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
