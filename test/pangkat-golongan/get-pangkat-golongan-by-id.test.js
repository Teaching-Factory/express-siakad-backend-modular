const httpMocks = require("node-mocks-http");
const { getPangkatGolonganById } = require("../../src/modules/pangkat-golongan/controller");
const { PangkatGolongan } = require("../../models");

jest.mock("../../models");

describe("getPangkatGolonganById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mendapatkan pangkat golongan by ID
  it("should return pangkat golongan by ID with status 200 if found", async () => {
    const pangkatGolonganId = 1;
    const mockPangkatGolongan = { id: pangkatGolonganId, nama: "Pangkat 1", golongan: "A" };

    PangkatGolongan.findByPk.mockResolvedValue(mockPangkatGolongan);
    req.params.id = pangkatGolonganId;

    await getPangkatGolonganById(req, res, next);

    expect(PangkatGolongan.findByPk).toHaveBeenCalledWith(pangkatGolonganId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Pangkat Golongan By ID ${pangkatGolonganId} Success:`,
      data: mockPangkatGolongan,
    });
  });

  // Kode uji 2 - Menangani kasus jika pangkat golongan tidak ditemukan
  it("should return 404 if pangkat golongan by ID is not found", async () => {
    const pangkatGolonganId = 999; // ID yang tidak ada
    PangkatGolongan.findByPk.mockResolvedValue(null);
    req.params.id = pangkatGolonganId;

    await getPangkatGolonganById(req, res, next);

    expect(PangkatGolongan.findByPk).toHaveBeenCalledWith(pangkatGolonganId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Pangkat Golongan With ID ${pangkatGolonganId} Not Found:`,
    });
  });

  // Kode uji 3 - Menangani kasus jika ID pangkat golongan tidak disediakan
  it("should return 400 if pangkat golongan ID is not provided", async () => {
    await getPangkatGolonganById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Pangkat Golongan ID is required",
    });
  });

  // Kode uji 4 - Menangani kasus jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    PangkatGolongan.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = 1;
    await getPangkatGolonganById(req, res, next);

    expect(PangkatGolongan.findByPk).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
