const httpMocks = require("node-mocks-http");
const { getAllUnitJabatan } = require("../../src/controllers/unit-jabatan");
const { UnitJabatan } = require("../../models");

jest.mock("../../models");

describe("getAllUnitJabatan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get all unit jabatan and return 200", async () => {
    const mockUnitJabatanData = [
      { id: 1, nama_unit: "Unit Jabatan A", Jabatan: { nama_jabatan: "Jabatan A" }, Dosen: { nama_dosen: "Dosen A" } },
      { id: 2, nama_unit: "Unit Jabatan B", Jabatan: { nama_jabatan: "Jabatan B" }, Dosen: { nama_dosen: "Dosen B" } },
    ];

    UnitJabatan.findAll.mockResolvedValue(mockUnitJabatanData);

    await getAllUnitJabatan(req, res, next);

    expect(UnitJabatan.findAll).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== GET All Unit Jabatan Success",
      jumlahData: mockUnitJabatanData.length,
      data: mockUnitJabatanData,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    UnitJabatan.findAll.mockRejectedValue(error);

    await getAllUnitJabatan(req, res, next);

    expect(UnitJabatan.findAll).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
