const httpMocks = require("node-mocks-http");
const { getBiodataDosenById } = require("../../src/controllers/biodata-dosen");
const { BiodataDosen } = require("../../models");

jest.mock("../../models");

describe("getBiodataDosenById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Kode uji 1 - Mengambil biodata dosen berdasarkan ID jika ditemukan
  it("should return biodata dosen by ID with status 200 if found", async () => {
    const biodataDosenId = "00006f67-3a43-4903-8c50-49eb02f4ded5";
    const mockBiodataDosen = { id: biodataDosenId, nama: "Biodata Dosen 1" };

    req.params.id = biodataDosenId;
    BiodataDosen.findByPk.mockResolvedValue(mockBiodataDosen);

    await getBiodataDosenById(req, res, next);

    expect(BiodataDosen.findByPk).toHaveBeenCalledWith(biodataDosenId);
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Biodata Dosen By ID ${biodataDosenId} Success:`,
      data: mockBiodataDosen,
    });
  });

  // Kode uji 2 - Menangani kasus jika ID biodata dosen tidak ditemukan
  it("should return 404 if biodata dosen by ID is not found", async () => {
    const biodataDosenId = "s";

    req.params.id = biodataDosenId;
    BiodataDosen.findByPk.mockResolvedValue(null);

    await getBiodataDosenById(req, res, next);

    expect(BiodataDosen.findByPk).toHaveBeenCalledWith(biodataDosenId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Biodata Dosen With ID ${biodataDosenId} Not Found:`,
    });
  });

  // Kode uji 3 - Menangani kasus jika ID biodata dosen tidak disediakan
  it("should return 400 if biodata dosen ID is not provided", async () => {
    req.params.id = null;

    await getBiodataDosenById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Biodata Dosen ID is required",
    });
  });

  // Kode uji 4 - Menangani kasus jika terjadi kesalahan saat melakukan operasi di database
  it("should call next with error if database query fails", async () => {
    const errorMessage = "Database error";
    const biodataDosenId = 1;

    req.params.id = biodataDosenId;
    BiodataDosen.findByPk.mockRejectedValue(new Error(errorMessage));

    await getBiodataDosenById(req, res, next);

    expect(BiodataDosen.findByPk).toHaveBeenCalledWith(biodataDosenId);
    expect(next).toHaveBeenCalledWith(new Error(errorMessage));
  });
});
