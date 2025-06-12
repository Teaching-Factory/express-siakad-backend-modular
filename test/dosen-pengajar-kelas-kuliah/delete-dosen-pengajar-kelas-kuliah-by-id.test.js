const httpMocks = require("node-mocks-http");
const { deleteDosenPengajarKelasKuliahById } = require("../../src/modules/dosen-pengajar-kelas-kuliah/controller");
const { DosenPengajarKelasKuliah } = require("../../models");

jest.mock("../../models");

describe("deleteDosenPengajarKelasKuliahById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should delete a dosen pengajar kelas kuliah and return 200", async () => {
    const mockDosenPengajarKelasKuliahId = 1;
    req.params.id = mockDosenPengajarKelasKuliahId;

    const mockDosenPengajarKelasKuliah = {
      id: mockDosenPengajarKelasKuliahId,
      destroy: jest.fn().mockResolvedValue(true),
    };

    DosenPengajarKelasKuliah.findByPk.mockResolvedValue(mockDosenPengajarKelasKuliah);

    await deleteDosenPengajarKelasKuliahById(req, res, next);

    expect(DosenPengajarKelasKuliah.findByPk).toHaveBeenCalledWith(mockDosenPengajarKelasKuliahId);
    expect(mockDosenPengajarKelasKuliah.destroy).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== DELETE Dosen Pengajar Kelas Kuliah With ID ${mockDosenPengajarKelasKuliahId} Success:`,
    });
  });

  it("should return 400 if dosen pengajar kelas kuliah ID is missing", async () => {
    await deleteDosenPengajarKelasKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Dosen Pengajar Kelas Kuliah ID is required",
    });
  });

  it("should return 404 if dosen pengajar kelas kuliah is not found", async () => {
    const mockDosenPengajarKelasKuliahId = 1;
    req.params.id = mockDosenPengajarKelasKuliahId;

    DosenPengajarKelasKuliah.findByPk.mockResolvedValue(null);

    await deleteDosenPengajarKelasKuliahById(req, res, next);

    expect(DosenPengajarKelasKuliah.findByPk).toHaveBeenCalledWith(mockDosenPengajarKelasKuliahId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Dosen Pengajar Kelas Kuliah With ID ${mockDosenPengajarKelasKuliahId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const mockDosenPengajarKelasKuliahId = 1;
    req.params.id = mockDosenPengajarKelasKuliahId;

    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    DosenPengajarKelasKuliah.findByPk.mockRejectedValue(error);

    await deleteDosenPengajarKelasKuliahById(req, res, next);

    expect(DosenPengajarKelasKuliah.findByPk).toHaveBeenCalledWith(mockDosenPengajarKelasKuliahId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
