const httpMocks = require("node-mocks-http");
const { updatePengaturanPMBActive } = require("../../src/controllers/pengaturan-pmb");
const { PengaturanPMB } = require("../../models");

jest.mock("../../models");

describe("updatePengaturanPMBActive", () => {
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
      nama_pemilik_rekening: "John Doe"
    };

    await updatePengaturanPMBActive(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "upload_bukti_transfer is required" });
  });

  it("should return 400 if nama_bank is missing", async () => {
    req.body = {
      upload_bukti_transfer: "upload_path",
      nomor_rekening: "12345678",
      nama_pemilik_rekening: "John Doe"
    };

    await updatePengaturanPMBActive(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nama_bank is required" });
  });

  it("should return 400 if nomor_rekening is missing", async () => {
    req.body = {
      upload_bukti_transfer: "upload_path",
      nama_bank: "Bank A",
      nama_pemilik_rekening: "John Doe"
    };

    await updatePengaturanPMBActive(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nomor_rekening is required" });
  });

  it("should return 400 if nama_pemilik_rekening is missing", async () => {
    req.body = {
      upload_bukti_transfer: "upload_path",
      nama_bank: "Bank A",
      nomor_rekening: "12345678"
    };

    await updatePengaturanPMBActive(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "nama_pemilik_rekening is required" });
  });

  it("should return 404 if no active Pengaturan PMB is found", async () => {
    req.body = {
      upload_bukti_transfer: "upload_path",
      nama_bank: "Bank A",
      nomor_rekening: "12345678",
      nama_pemilik_rekening: "John Doe"
    };

    PengaturanPMB.findOne.mockResolvedValue(null);

    await updatePengaturanPMBActive(req, res, next);

    expect(PengaturanPMB.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "<===== Pengaturan PMB Active Not Found:"
    });
  });

  it("should update active Pengaturan PMB and return 200 if data is valid", async () => {
    const pengaturan_pmb = {
      id: 1,
      upload_bukti_transfer: "old_upload_path",
      nama_bank: "Old Bank",
      nomor_rekening: "98765432",
      nama_pemilik_rekening: "Old Name",
      save: jest.fn().mockResolvedValue(true)
    };

    req.body = {
      upload_bukti_transfer: "new_upload_path",
      nama_bank: "New Bank",
      nomor_rekening: "12345678",
      nama_pemilik_rekening: "New Name"
    };

    PengaturanPMB.findOne.mockResolvedValue(pengaturan_pmb);

    await updatePengaturanPMBActive(req, res, next);

    expect(PengaturanPMB.findOne).toHaveBeenCalledWith({
      where: { status: true }
    });

    // Simulate the update operation
    expect(pengaturan_pmb.upload_bukti_transfer).toBe("new_upload_path");
    expect(pengaturan_pmb.nama_bank).toBe("New Bank");
    expect(pengaturan_pmb.nomor_rekening).toBe("12345678");
    expect(pengaturan_pmb.nama_pemilik_rekening).toBe("New Name");
    expect(pengaturan_pmb.save).toHaveBeenCalled();

    // Remove the save function from the pengaturan_pmb object before comparison
    const expectedData = { ...pengaturan_pmb };
    delete expectedData.save;

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "<===== UPDATE Pengaturan PMB Active Success:",
      data: expectedData
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Database error";
    const error = new Error(errorMessage);

    req.body = {
      upload_bukti_transfer: "new_upload_path",
      nama_bank: "New Bank",
      nomor_rekening: "12345678",
      nama_pemilik_rekening: "New Name"
    };

    PengaturanPMB.findOne.mockRejectedValue(error);

    await updatePengaturanPMBActive(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
