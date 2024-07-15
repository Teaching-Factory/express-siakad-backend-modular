const httpMocks = require("node-mocks-http");
const { createUnitJabatan } = require("../../src/controllers/unit-jabatan");
const { UnitJabatan } = require("../../models");

jest.mock("../../models");

describe("createUnitJabatan", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create unit jabatan and return 201 if 'nama_penandatanganan', 'id_dosen', 'id_jabatan', and 'id_prodi' are provided", async () => {
    const mockRequestBody = {
      nama_penandatanganan: "John Doe",
      id_dosen: 1,
      id_jabatan: 1,
      id_prodi: 1,
    };

    req.body = mockRequestBody;

    const mockCreatedUnitJabatan = {
      id: 1,
      nama_penandatanganan: mockRequestBody.nama_penandatanganan,
      id_dosen: mockRequestBody.id_dosen,
      id_jabatan: mockRequestBody.id_jabatan,
      id_prodi: mockRequestBody.id_prodi,
    };

    UnitJabatan.create.mockResolvedValue(mockCreatedUnitJabatan);

    await createUnitJabatan(req, res, next);

    expect(UnitJabatan.create).toHaveBeenCalledWith(mockRequestBody);
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Unit Jabatan Success",
      data: mockCreatedUnitJabatan,
    });
  });

  it("should return 400 if 'nama_penandatanganan' is not provided", async () => {
    const mockRequestBody = {
      id_dosen: 1,
      id_jabatan: 1,
      id_prodi: 1,
    };

    req.body = mockRequestBody;

    await createUnitJabatan(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nama_penandatanganan is required",
    });
    expect(UnitJabatan.create).not.toHaveBeenCalled();
  });

  it("should return 400 if 'id_dosen' is not provided", async () => {
    const mockRequestBody = {
      nama_penandatanganan: "John Doe",
      id_jabatan: 1,
      id_prodi: 1,
    };

    req.body = mockRequestBody;

    await createUnitJabatan(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_dosen is required",
    });
    expect(UnitJabatan.create).not.toHaveBeenCalled();
  });

  it("should return 400 if 'id_jabatan' is not provided", async () => {
    const mockRequestBody = {
      nama_penandatanganan: "John Doe",
      id_dosen: 1,
      id_prodi: 1,
    };

    req.body = mockRequestBody;

    await createUnitJabatan(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_jabatan is required",
    });
    expect(UnitJabatan.create).not.toHaveBeenCalled();
  });

  it("should return 400 if 'id_prodi' is not provided", async () => {
    const mockRequestBody = {
      nama_penandatanganan: "John Doe",
      id_dosen: 1,
      id_jabatan: 1,
    };

    req.body = mockRequestBody;

    await createUnitJabatan(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_prodi is required",
    });
    expect(UnitJabatan.create).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    const mockRequestBody = {
      nama_penandatanganan: "John Doe",
      id_dosen: 1,
      id_jabatan: 1,
      id_prodi: 1,
    };

    req.body = mockRequestBody;

    UnitJabatan.create.mockRejectedValue(error);

    await createUnitJabatan(req, res, next);

    expect(UnitJabatan.create).toHaveBeenCalledWith(mockRequestBody);
    expect(next).toHaveBeenCalledWith(error);
  });
});
