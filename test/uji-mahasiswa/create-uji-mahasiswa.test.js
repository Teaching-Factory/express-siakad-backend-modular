const httpMocks = require("node-mocks-http");
const { createUjiMahasiswa } = require("../../src/controllers/uji-mahasiswa");
const { UjiMahasiswa } = require("../../models");

jest.mock("../../models");

describe("createUjiMahasiswa", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create uji mahasiswa and return 201", async () => {
    const aktivitasId = 1;
    const mockUjiMahasiswaData = {
      id: 1,
      penguji_ke: "Penguji A",
      id_aktivitas: aktivitasId,
      id_kategori_kegiatan: 1,
      id_dosen: 1,
    };

    req.params.id_aktivitas = aktivitasId;
    req.body = {
      penguji_ke: mockUjiMahasiswaData.penguji_ke,
      id_kategori_kegiatan: mockUjiMahasiswaData.id_kategori_kegiatan,
      id_dosen: mockUjiMahasiswaData.id_dosen,
    };

    UjiMahasiswa.create.mockResolvedValue(mockUjiMahasiswaData);

    await createUjiMahasiswa(req, res, next);

    expect(UjiMahasiswa.create).toHaveBeenCalledWith({
      penguji_ke: mockUjiMahasiswaData.penguji_ke,
      id_aktivitas: aktivitasId,
      id_kategori_kegiatan: mockUjiMahasiswaData.id_kategori_kegiatan,
      id_dosen: mockUjiMahasiswaData.id_dosen,
    });

    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Uji Mahasiswa Success",
      data: mockUjiMahasiswaData,
    });
  });

  it("should return 400 if penguji_ke is not provided", async () => {
    req.body = {
      id_kategori_kegiatan: 1,
      id_dosen: 1,
    };

    await createUjiMahasiswa(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "penguji_ke is required",
    });
    expect(UjiMahasiswa.create).not.toHaveBeenCalled();
  });

  it("should return 400 if id_kategori_kegiatan is not provided", async () => {
    req.body = {
      penguji_ke: "Penguji A",
      id_dosen: 1,
    };

    await createUjiMahasiswa(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_kategori_kegiatan is required",
    });
    expect(UjiMahasiswa.create).not.toHaveBeenCalled();
  });

  it("should return 400 if id_dosen is not provided", async () => {
    req.body = {
      penguji_ke: "Penguji A",
      id_kategori_kegiatan: 1,
    };

    await createUjiMahasiswa(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_dosen is required",
    });
    expect(UjiMahasiswa.create).not.toHaveBeenCalled();
  });

  it("should return 400 if aktivitas ID is not provided", async () => {
    req.body = {
      penguji_ke: "Penguji A",
      id_kategori_kegiatan: 1,
      id_dosen: 1,
    };

    req.params.id_aktivitas = undefined;

    await createUjiMahasiswa(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "Aktivitas Mahasiswa ID is required",
    });
    expect(UjiMahasiswa.create).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    const aktivitasId = 1;
    const mockRequestBody = {
      penguji_ke: "Penguji A",
      id_kategori_kegiatan: 1,
      id_dosen: 1,
    };

    req.params.id_aktivitas = aktivitasId;
    req.body = mockRequestBody;

    UjiMahasiswa.create.mockRejectedValue(error);

    await createUjiMahasiswa(req, res, next);

    expect(UjiMahasiswa.create).toHaveBeenCalledWith({
      penguji_ke: mockRequestBody.penguji_ke,
      id_aktivitas: aktivitasId,
      id_kategori_kegiatan: mockRequestBody.id_kategori_kegiatan,
      id_dosen: mockRequestBody.id_dosen,
    });

    expect(next).toHaveBeenCalledWith(error);
  });
});
