const httpMocks = require("node-mocks-http");
const { createAspekPenilaianDosen } = require("../../src/modules/aspek-penilaian-dosen/controller");
const { AspekPenilaianDosen } = require("../../models");

jest.mock("../../models");

describe("createAspekPenilaianDosen", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should create a new aspek_penilaian_dosen and return 201 status", async () => {
    // Setup mock data
    const mockAspekPenilaianDosen = {
      nomor_urut_aspek: 1,
      aspek_penilaian: "Aspek 1",
      tipe_aspek_penilaian: "Tipe 1",
      deskripsi_pendek: "Deskripsi Pendek 1",
      id_semester: 1,
      tanggal_pembuatan: new Date().toISOString() // Format tanggal sebagai string ISO
    };

    // Set up mock implementation
    AspekPenilaianDosen.create.mockResolvedValue(mockAspekPenilaianDosen);

    // Set request body
    req.body = {
      nomor_urut_aspek: 1,
      aspek_penilaian: "Aspek 1",
      tipe_aspek_penilaian: "Tipe 1",
      deskripsi_pendek: "Deskripsi Pendek 1",
      id_semester: 1
    };

    // Call the controller function
    await createAspekPenilaianDosen(req, res, next);

    // Assertions
    expect(AspekPenilaianDosen.create).toHaveBeenCalledWith({
      nomor_urut_aspek: 1,
      aspek_penilaian: "Aspek 1",
      tipe_aspek_penilaian: "Tipe 1",
      deskripsi_pendek: "Deskripsi Pendek 1",
      tanggal_pembuatan: expect.any(Date),
      id_semester: 1
    });
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Aspek Penilaian Dosen Success",
      data: {
        ...mockAspekPenilaianDosen,
        tanggal_pembuatan: expect.any(String) // Pastikan tanggal_pembuatan adalah string
      }
    });
  });

  it("should return 400 if nomor_urut_aspek is missing", async () => {
    req.body = {
      aspek_penilaian: "Aspek 1",
      tipe_aspek_penilaian: "Tipe 1",
      deskripsi_pendek: "Deskripsi Pendek 1",
      id_semester: 1
    };

    await createAspekPenilaianDosen(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "nomor_urut_aspek is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if aspek_penilaian is missing", async () => {
    req.body = {
      nomor_urut_aspek: 1,
      tipe_aspek_penilaian: "Tipe 1",
      deskripsi_pendek: "Deskripsi Pendek 1",
      id_semester: 1
    };

    await createAspekPenilaianDosen(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "aspek_penilaian is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if id_semester is missing", async () => {
    req.body = {
      nomor_urut_aspek: 1,
      aspek_penilaian: "Aspek 1",
      tipe_aspek_penilaian: "Tipe 1",
      deskripsi_pendek: "Deskripsi Pendek 1"
    };

    await createAspekPenilaianDosen(req, res, next);

    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toEqual({
      message: "id_semester is required"
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    AspekPenilaianDosen.create.mockRejectedValue(error);

    req.body = {
      nomor_urut_aspek: 1,
      aspek_penilaian: "Aspek 1",
      tipe_aspek_penilaian: "Tipe 1",
      deskripsi_pendek: "Deskripsi Pendek 1",
      id_semester: 1
    };

    await createAspekPenilaianDosen(req, res, next);

    expect(AspekPenilaianDosen.create).toHaveBeenCalledWith({
      nomor_urut_aspek: 1,
      aspek_penilaian: "Aspek 1",
      tipe_aspek_penilaian: "Tipe 1",
      deskripsi_pendek: "Deskripsi Pendek 1",
      tanggal_pembuatan: expect.any(Date),
      id_semester: 1
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
