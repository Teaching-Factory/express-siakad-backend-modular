const httpMocks = require("node-mocks-http");
const { getPekerjaanById } = require("../../src/modules/pekerjaan/controller");
const { Pekerjaan } = require("../../models");

jest.mock("../../models");

describe("getPekerjaanById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil pekerjaan berdasarkan ID jika ID tersedia
  it("should return pekerjaan by ID with status 200 if found", async () => {
    const PekerjaanId = 1;
    const mockPekerjaan = { id: PekerjaanId, nama: "Pekerjaan 1" };

    req.params.id = PekerjaanId;
    Pekerjaan.findByPk.mockResolvedValue(mockPekerjaan);

    await getPekerjaanById(req, res, next);

    expect(Pekerjaan.findByPk).toHaveBeenCalledWith(PekerjaanId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Pekerjaan By ID ${PekerjaanId} Success:`,
      data: mockPekerjaan,
    });
  });

  // Kode uji 2 - Mengembalikan status 400 jika ID pekerjaan tidak disediakan
  it("should return 400 if pekerjaan ID is not provided", async () => {
    await getPekerjaanById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Pekerjaan ID is required",
    });
  });

  // Kode uji 3 - Mengembalikan status 404 jika pekerjaan dengan ID yang diberikan tidak ditemukan
  it("should return 404 if pekerjaan by ID is not found", async () => {
    const PekerjaanId = 999;

    req.params.id = PekerjaanId;
    Pekerjaan.findByPk.mockResolvedValue(null);

    await getPekerjaanById(req, res, next);

    expect(Pekerjaan.findByPk).toHaveBeenCalledWith(PekerjaanId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Pekerjaan With ID ${PekerjaanId} Not Found:`,
    });
  });

  // Kode uji 4 - Menangani kasus jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const PekerjaanId = 1;
    const errorMessage = "Database error";

    req.params.id = PekerjaanId;
    Pekerjaan.findByPk.mockRejectedValue(new Error(errorMessage));

    await getPekerjaanById(req, res, next);

    expect(Pekerjaan.findByPk).toHaveBeenCalledWith(PekerjaanId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
