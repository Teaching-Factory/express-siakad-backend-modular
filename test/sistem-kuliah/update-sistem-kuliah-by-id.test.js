const httpMocks = require("node-mocks-http");
const { updateSistemKuliahById } = require("../../src/controllers/sistem-kuliah");
const { SistemKuliah } = require("../../models");

jest.mock("../../models");

describe("updateSistemKuliahById", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should update sistem kuliah and return 200 if 'nama_sk', 'kode_sk', and 'id' are provided", async () => {
    const sistemKuliahId = 1;
    const mockRequestBody = {
      nama_sk: "Updated Sistem Kuliah",
      kode_sk: "USK001",
    };

    req.params.id = sistemKuliahId;
    req.body = mockRequestBody;

    const mockUpdatedSistemKuliah = {
      id: sistemKuliahId,
      nama_sk: mockRequestBody.nama_sk,
      kode_sk: mockRequestBody.kode_sk,
      save: jest.fn().mockResolvedValue({
        id: sistemKuliahId,
        nama_sk: mockRequestBody.nama_sk,
        kode_sk: mockRequestBody.kode_sk,
      }),
    };

    SistemKuliah.findByPk.mockResolvedValue(mockUpdatedSistemKuliah);

    await updateSistemKuliahById(req, res, next);

    expect(SistemKuliah.findByPk).toHaveBeenCalledWith(sistemKuliahId);
    expect(mockUpdatedSistemKuliah.save).toHaveBeenCalled();
    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toEqual({
      message: `<===== UPDATE Unit Sistem Kuliah With ID ${sistemKuliahId} Success:`,
      data: {
        id: sistemKuliahId,
        nama_sk: mockUpdatedSistemKuliah.nama_sk,
        kode_sk: mockUpdatedSistemKuliah.kode_sk,
      },
    });
  });

  it("should return 400 if 'nama_sk' is not provided", async () => {
    const sistemKuliahId = 1;
    const mockRequestBody = {
      kode_sk: "USK001",
    };

    req.params.id = sistemKuliahId;
    req.body = mockRequestBody;

    await updateSistemKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_sk is required",
    });
    expect(SistemKuliah.findByPk).not.toHaveBeenCalled();
  });

  it("should return 400 if 'kode_sk' is not provided", async () => {
    const sistemKuliahId = 1;
    const mockRequestBody = {
      nama_sk: "Updated Sistem Kuliah",
    };

    req.params.id = sistemKuliahId;
    req.body = mockRequestBody;

    await updateSistemKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "kode_sk is required",
    });
    expect(SistemKuliah.findByPk).not.toHaveBeenCalled();
  });

  it("should return 400 if 'id' is not provided", async () => {
    const mockRequestBody = {
      nama_sk: "Updated Sistem Kuliah",
      kode_sk: "USK001",
    };

    req.body = mockRequestBody;

    await updateSistemKuliahById(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Sistem Kuliah Mahasiswa ID is required",
    });
    expect(SistemKuliah.findByPk).not.toHaveBeenCalled();
  });

  it("should return 404 if sistem kuliah is not found", async () => {
    const sistemKuliahId = 999; // ID yang tidak ada dalam database
    const mockRequestBody = {
      nama_sk: "Updated Sistem Kuliah",
      kode_sk: "USK001",
    };

    req.params.id = sistemKuliahId;
    req.body = mockRequestBody;

    SistemKuliah.findByPk.mockResolvedValue(null);

    await updateSistemKuliahById(req, res, next);

    expect(SistemKuliah.findByPk).toHaveBeenCalledWith(sistemKuliahId);
    expect(res.statusCode).toEqual(404);
    expect(res._getJSONData()).toEqual({
      message: `<===== Unit Sistem Kuliah With ID ${sistemKuliahId} Not Found:`,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);
    const sistemKuliahId = 1;
    const mockRequestBody = {
      nama_sk: "Updated Sistem Kuliah",
      kode_sk: "USK001",
    };

    req.params.id = sistemKuliahId;
    req.body = mockRequestBody;

    SistemKuliah.findByPk.mockRejectedValue(error);

    await updateSistemKuliahById(req, res, next);

    expect(SistemKuliah.findByPk).toHaveBeenCalledWith(sistemKuliahId);
    expect(next).toHaveBeenCalledWith(error);
  });
});
