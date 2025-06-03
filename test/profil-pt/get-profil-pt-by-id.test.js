const { getProfilPTById } = require("../../src/modules/profil-pt/controller");
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

  // Kode uji 1 - mengambil data profil pt dengan id yang valid
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

  // Kode uji 2 - mengambil data profil pt dengan id yang tidak valid
  it("should return 404 if profil_pt is not found", async () => {
    const profilPTId = "s";

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

  // Kode uji 3 - tidak memasukkan id profil pt pada parameter
  it("should return error response when id profil pt is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID profil pt dalam parameter

    await getProfilPTById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Profil PT ID is required",
    });
  });

  // Kode uji 4 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
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
