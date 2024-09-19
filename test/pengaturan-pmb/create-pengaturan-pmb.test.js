const httpMocks = require("node-mocks-http");
const { createPengaturanPMB } = require("../../src/controllers/pengaturan-pmb");
const { PengaturanPMB } = require("../../models");

jest.mock("../../models");

describe("createPengaturanPMB", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if upload_bukti_transfer is missing", async () => {
    req.body = {
      nama_bank: "Bank A",
      nomor_rekening: "12345678",
      nama_pemilik_rekening: "John Doe",
      status: true
    };

    await createPengaturanPMB(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "upload_bukti_transfer is required" });
  });

  it("should return 400 if nama_bank is missing", async () => {
    req.body = {
      upload_bukti_transfer: "upload_path",
      nomor_rekening: "12345678",
      nama_pemilik_rekening: "John Doe",
      status: true
    };

    await createPengaturanPMB(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nama_bank is required" });
  });

  it("should return 400 if nomor_rekening is missing", async () => {
    req.body = {
      upload_bukti_transfer: "upload_path",
      nama_bank: "Bank A",
      nama_pemilik_rekening: "John Doe",
      status: true
    };

    await createPengaturanPMB(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nomor_rekening is required" });
  });

  it("should return 400 if nama_pemilik_rekening is missing", async () => {
    req.body = {
      upload_bukti_transfer: "upload_path",
      nama_bank: "Bank A",
      nomor_rekening: "12345678",
      status: true
    };

    await createPengaturanPMB(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nama_pemilik_rekening is required" });
  });

  it("should return 400 if status is missing", async () => {
    req.body = {
      upload_bukti_transfer: "upload_path",
      nama_bank: "Bank A",
      nomor_rekening: "12345678",
      nama_pemilik_rekening: "John Doe"
    };

    await createPengaturanPMB(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "status is required" });
  });

  it("should create a new Pengaturan PMB and return 201 if data is valid", async () => {
    const newPengaturanPMB = {
      id: 1,
      upload_bukti_transfer: "upload_path",
      nama_bank: "Bank A",
      nomor_rekening: "12345678",
      nama_pemilik_rekening: "John Doe",
      status: true
    };

    req.body = {
      upload_bukti_transfer: "upload_path",
      nama_bank: "Bank A",
      nomor_rekening: "12345678",
      nama_pemilik_rekening: "John Doe",
      status: true
    };

    PengaturanPMB.create.mockResolvedValue(newPengaturanPMB);

    await createPengaturanPMB(req, res, next);

    expect(PengaturanPMB.create).toHaveBeenCalledWith({
      upload_bukti_transfer: "upload_path",
      nama_bank: "Bank A",
      nomor_rekening: "12345678",
      nama_pemilik_rekening: "John Doe",
      status: true
    });
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: "<===== CREATE Pengaturan PMB Success",
      data: newPengaturanPMB
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.body = {
      upload_bukti_transfer: "upload_path",
      nama_bank: "Bank A",
      nomor_rekening: "12345678",
      nama_pemilik_rekening: "John Doe",
      status: true
    };

    PengaturanPMB.create.mockRejectedValue(error);

    await createPengaturanPMB(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
