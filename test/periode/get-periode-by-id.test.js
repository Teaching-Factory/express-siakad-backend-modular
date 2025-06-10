const httpMocks = require("node-mocks-http");
const { getPeriodeById } = require("../../src/modules/periode/controller");
const { Periode, Prodi } = require("../../models");

jest.mock("../../models");

describe("getPeriodeById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - menguji dengan memasukkan data id periode yang valid
  it("should return periode data with status 200 if found", async () => {
    const periodeId = 1;
    const mockPeriode = {
      id: periodeId,
      nama_periode: "Periode 1",
      Prodi: { nama: "Prodi 1" },
    };

    Periode.findByPk.mockResolvedValue(mockPeriode);

    req.params.id = periodeId;

    await getPeriodeById(req, res, next);

    expect(Periode.findByPk).toHaveBeenCalledWith(periodeId, {
      include: [{ model: Prodi }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Periode By ID ${periodeId} Success:`,
      data: mockPeriode,
    });
  });

  // Kode uji 2 - menguji dengan memasukkan data id periode yang tidak valid
  it("should return 404 if periode is not found", async () => {
    const periodeId = "s"; // ID yang tidak ada
    const errorMessage = `<===== Periode With ID ${periodeId} Not Found:`;

    Periode.findByPk.mockResolvedValue(null);

    req.params.id = periodeId;

    await getPeriodeById(req, res, next);

    expect(Periode.findByPk).toHaveBeenCalledWith(periodeId, {
      include: [{ model: Prodi }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({ message: errorMessage });
  });

  // Kode uji 3 - tidak memasukkan id periode pada parameter
  it("should return error response when id periode is not provided", async () => {
    req.params.id = undefined; // Tidak ada ID periode dalam parameter

    await getPeriodeById(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Periode ID is required",
    });
  });

  // Kode uji 4 - menguji penanganan error jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const periodeId = 1;
    const errorMessage = "Database error";

    Periode.findByPk.mockRejectedValue(new Error(errorMessage));

    req.params.id = periodeId;

    await getPeriodeById(req, res, next);

    expect(Periode.findByPk).toHaveBeenCalledWith(periodeId, {
      include: [{ model: Prodi }],
    });
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
