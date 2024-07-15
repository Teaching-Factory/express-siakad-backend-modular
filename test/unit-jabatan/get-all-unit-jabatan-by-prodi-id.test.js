const httpMocks = require("node-mocks-http");
const { getAllUnitJabatanByProdiId } = require("../../src/controllers/unit-jabatan");
const { UnitJabatan, Jabatan, Dosen, Prodi } = require("../../models");

jest.mock("../../models");

describe("getAllUnitJabatanByProdiId", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if prodi ID is not provided", async () => {
    req.params.id_prodi = undefined;

    await getAllUnitJabatanByProdiId(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Prodi ID is required",
    });
    expect(UnitJabatan.findAll).not.toHaveBeenCalled();
  });

  it("should return 404 if no unit jabatan is found", async () => {
    const prodiId = 999; // ID yang tidak ada dalam database
    req.params.id_prodi = prodiId;

    UnitJabatan.findAll.mockResolvedValue(null);

    await getAllUnitJabatanByProdiId(req, res, next);

    expect(UnitJabatan.findAll).toHaveBeenCalledWith({
      where: { id_prodi: prodiId },
      include: [{ model: Jabatan }, { model: Dosen }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Unit Jabatan With Prodi ID ${prodiId} Not Found:`,
    });
  });

  it("should get all unit jabatan by prodi ID and return 200", async () => {
    const prodiId = 1;
    const mockUnitJabatanData = [
      {
        id: 1,
        nama_unit: "Unit Jabatan A",
        Jabatan: { nama_jabatan: "Jabatan A" },
        Dosen: { nama_dosen: "Dosen A" },
        Prodi: { nama_prodi: "Prodi A" },
      },
      {
        id: 2,
        nama_unit: "Unit Jabatan B",
        Jabatan: { nama_jabatan: "Jabatan B" },
        Dosen: { nama_dosen: "Dosen B" },
        Prodi: { nama_prodi: "Prodi A" },
      },
    ];

    req.params.id_prodi = prodiId;
    UnitJabatan.findAll.mockResolvedValue(mockUnitJabatanData);

    await getAllUnitJabatanByProdiId(req, res, next);

    expect(UnitJabatan.findAll).toHaveBeenCalledWith({
      where: { id_prodi: prodiId },
      include: [{ model: Jabatan }, { model: Dosen }, { model: Prodi }],
    });
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== GET Unit Jabatan By Prodi ID ${prodiId} Success:`,
      jumlahData: mockUnitJabatanData.length,
      data: mockUnitJabatanData,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const prodiId = 1;
    req.params.id_prodi = prodiId;

    UnitJabatan.findAll.mockRejectedValue(error);

    await getAllUnitJabatanByProdiId(req, res, next);

    expect(UnitJabatan.findAll).toHaveBeenCalledWith({
      where: { id_prodi: prodiId },
      include: [{ model: Jabatan }, { model: Dosen }, { model: Prodi }],
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
