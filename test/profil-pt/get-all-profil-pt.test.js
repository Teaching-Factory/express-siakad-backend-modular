const { getAllProfilPT } = require("../../src/controllers/profil-pt");
const { ProfilPT, PerguruanTinggi, Wilayah } = require("../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../models");

describe("getAllProfilPT", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should return 200 and all profil_pt data if found", async () => {
    const mockProfilPT = [
      { id: 1, PerguruanTinggi: { id: 1, name: "PT 1" }, Wilayah: { id: 1, name: "Wilayah 1" } },
      { id: 2, PerguruanTinggi: { id: 2, name: "PT 2" }, Wilayah: { id: 2, name: "Wilayah 2" } },
    ];

    ProfilPT.findAll.mockResolvedValue(mockProfilPT);

    await getAllProfilPT(req, res, next);

    expect(ProfilPT.findAll).toHaveBeenCalledWith({
      include: [{ model: PerguruanTinggi }, { model: Wilayah }],
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Profil PT Success",
      jumlahData: mockProfilPT.length,
      data: mockProfilPT,
    });
  });

  it("should handle errors correctly", async () => {
    const errorMessage = "Database error";
    const rejectedPromise = Promise.reject(new Error(errorMessage));
    ProfilPT.findAll.mockReturnValue(rejectedPromise);

    await getAllProfilPT(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
